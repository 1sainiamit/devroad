import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized. Please log in to purchase.", { status: 401 });
    }

    const body = await req.json();
    const { items } = body as { items: { productId: string; quantity: number }[] };

    if (!items || items.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    // Fetch products from database to ensure pricing is accurate
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length === 0) {
      return new NextResponse("Products not found", { status: 404 });
    }

    let totalInCents = 0;
    const orderItemsData = [];
    const line_items = [];
    const currency = products[0].currency.toLowerCase();

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        totalInCents += product.priceInCents * item.quantity;
        
        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          unitPriceInCents: product.priceInCents,
          quantity: item.quantity,
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const images = product.coverImageUrl 
          ? [product.coverImageUrl.startsWith('http') ? product.coverImageUrl : `${appUrl}${product.coverImageUrl}`] 
          : [];

        line_items.push({
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.name,
              images,
            },
            unit_amount: product.priceInCents,
          },
          quantity: item.quantity,
        });
      }
    }

    // If total is 0 (free products), we could bypass Stripe, but for now we'll let Stripe handle $0 checkouts or just create the order directly.
    // Stripe actually doesn't allow $0 checkouts for one-time payments unless it's a subscription setup. 
    // We'll handle free checkouts immediately:
    if (totalInCents === 0) {
      await prisma.order.create({
        data: {
          buyerId: user.id,
          totalInCents,
          currency: currency.toUpperCase(),
          status: "PAID", // Automatically paid if free
          items: {
            create: orderItemsData,
          },
        },
      });
      return NextResponse.json({ url: "/success" });
    }

    if (totalInCents < 50) {
      return new NextResponse("The minimum checkout amount must be at least $0.50", { status: 400 });
    }

    // Create a pending order in the database
    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        totalInCents,
        currency: currency.toUpperCase(),
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/discover`,
      metadata: {
        orderId: order.id,
      },
    });

    // Update order with Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
