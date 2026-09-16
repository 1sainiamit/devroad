import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { LibraryCard } from "@/components/library/library-card";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LibraryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all PAID orders for the current user, including items and their products
  const orders = await prisma.order.findMany({
    where: {
      buyerId: user.id,
      status: "PAID",
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              creator: {
                select: {
                  name: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Extract unique products from all orders
  const productMap = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productMap.has(item.productId)) {
        productMap.set(item.productId, item.product);
      }
    });
  });

  const purchasedProducts = Array.from(productMap.values());

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-black">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          My Library
        </h1>
      </div>

      {purchasedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-4 border-dashed border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border-2 border-black mb-4">
            <BookOpen className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-2xl font-black mb-2">Your library is empty</h2>
          <p className="text-muted-foreground font-medium max-w-sm mb-6">
            You haven't purchased any products yet. Discover amazing creations from talented creators.
          </p>
          <Link href="/discover">
            <Button className="bg-[#ff90e8] text-black border-2 border-black hover:bg-[#ff90e8]/90 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {purchasedProducts.map((product) => (
            <LibraryCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
