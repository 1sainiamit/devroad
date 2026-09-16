import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { Wallet, CheckCircle2, AlertCircle } from "lucide-react";
import { PayoutButtons } from "@/components/payouts/payout-buttons";
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

  let isConnected = false;
  let isPending = false;

  if (dbUser.stripeConnectAccountId) {
    try {
      const account = await stripe.accounts.retrieve(dbUser.stripeConnectAccountId);
      if (account.details_submitted) {
        isConnected = true;
      } else {
        isPending = true;
      }
    } catch (error) {
      console.error("Failed to retrieve Stripe account", error);
    }
  }

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
        {!isConnected && !isPending ? (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-muted border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Wallet className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-black">Get Paid Faster</h2>
            <p className="text-lg font-bold text-muted-foreground max-w-lg mx-auto mb-10">
              Connect your bank account via Stripe to securely receive payouts directly to your local bank account.
            </p>
            <PayoutButtons isConnected={false} />
          </div>
        ) : isPending ? (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-yellow-200 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-black">Setup Incomplete</h2>
            <p className="text-lg font-bold text-muted-foreground max-w-lg mx-auto mb-10">
              You started setting up your payouts, but Stripe needs more information before you can receive money.
            </p>
            <PayoutButtons isConnected={false} />
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
                  Update your bank details or view past payout history on Stripe.
                </p>
              </div>
              <PayoutButtons isConnected={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
