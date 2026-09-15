"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface BuyButtonProps {
  product: {
    id: string;
    name: string;
    priceInCents: number;
    currency: string;
    coverImageUrl: string | null;
    creatorName: string;
    slug: string;
  };
}

export function BuyButton({ product }: BuyButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "USD",
  }).format(product.priceInCents / 100);

  const handleBuy = async () => {
    setIsPending(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500));
    addItem(product);
    setIsPending(false);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Button 
      onClick={handleBuy}
      disabled={isPending}
      className="w-full h-14 text-lg font-medium bg-[#ff90e8] text-black hover:bg-[#ff90e8]/90 transition-colors rounded-md"
    >
      {isPending ? (
        <Loader2 className="w-6 h-6 animate-spin text-black" />
      ) : (
        product.priceInCents === 0 ? "I want this!" : `Add to cart - ${formattedPrice}`
      )}
    </Button>
  );
}
