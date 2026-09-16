"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart when the user lands on the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f0] p-6 text-black">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-600 shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground font-medium">
          Thank you for your purchase. Your payment has been processed successfully and the creator has been notified.
        </p>

        <div className="pt-4 flex flex-col gap-4">
          <Link href="/library" className="w-full block">
            <Button className="w-full h-14 text-lg font-bold bg-[#ff90e8] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff90e8]/90 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              Go to my Library
            </Button>
          </Link>
          <Link href="/discover" className="w-full block">
            <Button variant="outline" className="w-full h-14 text-lg font-bold border-4 border-black hover:bg-muted transition-all">
              Continue Shopping <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
