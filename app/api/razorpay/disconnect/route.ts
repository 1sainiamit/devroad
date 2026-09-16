import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        razorpayAccountId: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RAZORPAY_DISCONNECT_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
