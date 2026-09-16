"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PayoutButtonsProps {
  isConnected: boolean;
}

export function PayoutButtons({ isConnected }: PayoutButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to generate connect link.");
      }
    } catch (error) {
      toast.error("An error occurred while connecting to Stripe.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/stripe/login", { method: "POST" });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to generate dashboard link.");
      }
    } catch (error) {
      toast.error("An error occurred while accessing Stripe dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <Button 
        onClick={handleLogin} 
        disabled={isLoading}
        className="w-full sm:w-auto h-12 px-8 bg-white text-black border-4 border-black hover:bg-muted font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-lg"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <ExternalLink className="w-5 h-5 mr-2" />
        )}
        View Stripe Dashboard
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isLoading}
      className="w-full sm:w-auto h-14 px-8 bg-[#ff90e8] text-black border-4 border-black hover:bg-[#ff90e8]/90 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-xl"
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
      ) : (
        <ArrowRight className="w-6 h-6 mr-2" />
      )}
      Set up Payouts
    </Button>
  );
}
