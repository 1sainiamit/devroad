import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeConnectAccountId: true },
    });

    if (!dbUser || !dbUser.stripeConnectAccountId) {
      return new NextResponse("No Stripe account connected", { status: 400 });
    }

    // Create a login link to the Stripe Express Dashboard
    const loginLink = await stripe.accounts.createLoginLink(
      dbUser.stripeConnectAccountId,
    );

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    console.error("[STRIPE_LOGIN_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
