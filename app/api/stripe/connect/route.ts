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

    // Get the latest user from the DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    let accountId = dbUser.stripeConnectAccountId;

    // If the user doesn't have a Stripe Connect account, create one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: dbUser.email,
        capabilities: {
          transfers: { requested: true },
        },
      });

      accountId = account.id;

      // Save the account ID to our database
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeConnectAccountId: accountId },
      });
    }

    // Create an Account Link for onboarding
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/payouts`,
      return_url: `${appUrl}/payouts`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("[STRIPE_CONNECT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
