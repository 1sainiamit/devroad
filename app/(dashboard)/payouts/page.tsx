import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { OnboardingForm } from "@/components/payouts/onboarding-form";
import { Wallet, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PayoutsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const isConnected = !!dbUser.razorpayAccountId;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-4 flex items-center gap-4 text-black">
          <Wallet className="w-10 h-10" />
          Creator Payouts
        </h1>
        <p className="text-xl font-bold text-muted-foreground">
          Manage your bank details and get paid for your sales.
        </p>
      </div>

      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {!isConnected ? (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-muted border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Wallet className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-black">Get Paid Faster</h2>
            <p className="text-lg font-bold text-muted-foreground max-w-lg mx-auto mb-6">
              Connect your bank account to securely receive payouts directly via Razorpay.
            </p>
            <OnboardingForm isConnected={false} />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-8 pb-8 border-b-4 border-black">
              <div className="w-16 h-16 bg-green-300 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black">Payouts Active</h2>
                <p className="font-bold text-muted-foreground">Your bank account is connected securely.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-black mb-1">Manage Settings</h3>
                <p className="font-medium text-muted-foreground">
                  Update your bank details or view past payout history.
                </p>
              </div>
              <OnboardingForm isConnected={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
