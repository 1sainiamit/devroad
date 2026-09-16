"use client";

import { useCartStore } from "@/store/useCartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCartStore();
  const cartTotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(cartTotal);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        toast.error(error || "Something went wrong during checkout.");
        setIsCheckingOut(false);
        return;
      }

      const data = await response.json();
      if (data.url) {
        router.push(data.url);
        return;
      }

      if (data.orderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
          amount: data.amount,
          currency: data.currency,
          name: "Devroad",
          description: "Digital Product Purchase",
          order_id: data.orderId,
          handler: function () {
            router.push(`/success?order_id=${data.orderId}`);
          },
          prefill: {
            name: data.user?.name || "",
            email: data.user?.email || "",
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: function() {
              setIsCheckingOut(false);
            }
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (){
           toast.error("Payment failed. Please try again.");
           setIsCheckingOut(false);
        });
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during checkout.");
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l-4 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] bg-background flex flex-col p-0">
        <SheetHeader className="p-6 border-b-4 border-black bg-white">
          <SheetTitle className="text-2xl font-black flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="text-xl font-bold">Your cart is empty</p>
                <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
              </div>
              <Button onClick={() => onOpenChange(false)} className="mt-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 border-2 border-black p-3 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-20 h-20 bg-muted border-2 border-black relative rounded-md overflow-hidden shrink-0">
                  {item.product.coverImageUrl ? (
                    <Image src={item.product.coverImageUrl} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <Link href={`/${item.product.slug}`} onClick={() => onOpenChange(false)} className="font-bold line-clamp-1 hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mb-auto">{item.product.creatorName}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border-2 border-black rounded-md overflow-hidden bg-white">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors border-r-2 border-black"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors border-l-2 border-black"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-black text-lg">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: item.product.currency || "INR" }).format(item.product.price)}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors bg-white rounded-full border-2 border-transparent hover:border-destructive shadow-sm"
                  style={{ position: 'relative', top: '-10px', right: '-10px' }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t-4 border-black bg-white flex flex-col gap-4 sm:flex-col">
            <div className="flex items-center justify-between text-xl font-black">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>
            <Button 
              onClick={handleCheckout} 
              disabled={isCheckingOut}
              className="w-full h-14 text-lg font-black bg-primary text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
