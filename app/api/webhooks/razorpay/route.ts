import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return new NextResponse("Missing razorpay signature", { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === "order.paid") {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      if (orderId) {
        await prisma.order.update({
          where: { razorpayOrderId: orderId },
          data: {
            status: "PAID",
            razorpayPaymentId: paymentId,
          },
        });
        console.log(`[WEBHOOK] Razorpay Order ${orderId} marked as PAID`);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
  }
}
