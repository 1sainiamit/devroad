import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { businessName, accountNumber, ifscCode } = body;

    if (!businessName || !accountNumber || !ifscCode) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // In a real production environment, you would call Razorpay's Route/Linked Accounts API here:
    // const account = await razorpay.accounts.create({
    //   email: user.email,
    //   type: "route",
    //   legal_business_name: businessName,
    //   business_type: "individual",
    //   // ... bank details mapping
    // });
    
    // For this portfolio project, we simulate a successful linked account creation 
    // by generating a mock Razorpay Account ID.
    const mockRazorpayAccountId = `acc_${Math.random().toString(36).substring(2, 14)}`;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        razorpayAccountId: mockRazorpayAccountId,
      },
    });

    return NextResponse.json({ success: true, accountId: mockRazorpayAccountId });
  } catch (error) {
    console.error("[RAZORPAY_CONNECT_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
