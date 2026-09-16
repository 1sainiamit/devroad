import { razorpay } from "@/lib/razorpay";
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

    let total = 0;
    const orderItemsData: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
    }[] = [];
    const currency = "INR"; // Switching default to INR for Razorpay

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
        
        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
        });
      }
    }

    // Handle free checkouts
    if (total === 0) {
      await prisma.order.create({
        data: {
          buyerId: user.id,
          total,
          currency: currency.toUpperCase(),
          status: "PAID",
          items: {
            create: orderItemsData,
          },
        },
      });
      return NextResponse.json({ url: "/success" });
    }

    // Minimum checkout for Razorpay in INR is 100 paise (1 INR)
    if (total < 1) {
      return new NextResponse("The minimum checkout amount must be at least ₹1", { status: 400 });
    }

    // Create a pending order in the database
    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        total,
        currency: currency.toUpperCase(),
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    // Create Razorpay Order
    const options = {
      amount: total * 100, // Amount in paise for Razorpay
      currency: currency.toUpperCase(),
      receipt: order.id,
    };
    
    const rzpOrder = await razorpay.orders.create(options);

    // Update order with Razorpay Order ID
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    });

    return NextResponse.json({ 
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      user: {
        name: user.name || "Customer",
        email: user.email
      }
    });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
