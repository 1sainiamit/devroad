"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Globe, Lock } from "lucide-react";
import { togglePublishStatus } from "@/app/actions/products";
import { ProductStatus } from "@/generated/prisma/enums";

export function PublishButton({ productId, currentStatus }: { productId: string, currentStatus: ProductStatus }) {
  const [isPending, startTransition] = useTransition();
  const isPublished = currentStatus === "PUBLISHED";

  const handleToggle = () => {
    startTransition(async () => {
      const response = await togglePublishStatus(productId);
      if (response.success) {
        toast.success(`Product is now ${isPublished ? "Draft" : "Published"}!`);
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Button 
      onClick={handleToggle}
      disabled={isPending}
      className={`h-10 px-4 font-bold border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
        isPublished 
          ? "bg-amber-100 text-amber-900 hover:bg-amber-200" 
          : "bg-green-400 text-black hover:bg-green-500"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isPublished ? (
        <Lock className="w-4 h-4 mr-2" />
      ) : (
        <Globe className="w-4 h-4 mr-2" />
      )}
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}
