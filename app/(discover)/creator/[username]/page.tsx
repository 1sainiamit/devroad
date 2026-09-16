import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { UserCircle } from "lucide-react";
import Image from "next/image";

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const creator = await prisma.user.findFirst({
    where: { 
      OR: [
        { username: username },
        { id: username }
      ]
    },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          creator: {
            select: {
              name: true,
              username: true,
              avatarUrl: true,
            }
          }
        }
      },
    },
  });

  if (!creator) {
    notFound();
  }

  const displayName = creator.name || creator.username || "Anonymous";

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Profile Header */}
      <div className="bg-[#2a2a2a] border-b-2 border-white/10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-white/5 border-4 border-white/20 rounded-full flex items-center justify-center mb-6 overflow-hidden relative shadow-[0_0_40px_rgba(255,144,232,0.1)]">
            {creator.avatarUrl ? (
              <Image 
                src={creator.avatarUrl} 
                alt={displayName} 
                fill
                sizes="128px"
                className="object-cover" 
              />
            ) : (
              <UserCircle className="w-20 h-20 text-white/40" />
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            {displayName}
          </h1>
          <p className="text-[#ff90e8] font-bold text-lg mb-6">
            @{creator.username}
          </p>
          {creator.bio && (
            <p className="text-white/80 max-w-2xl text-lg font-medium">
              {creator.bio}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-white">
            Products by {displayName}
          </h2>
          <div className="text-white/60 font-medium bg-white/10 px-4 py-1.5 rounded-full">
            {creator.products.length} {creator.products.length === 1 ? "product" : "products"}
          </div>
        </div>

        {creator.products.length === 0 ? (
          <div className="text-center py-24 bg-black/30 border-2 border-dashed border-white/10 rounded-3xl">
            <h3 className="text-xl font-bold mb-2 text-white/50">No products available</h3>
            <p className="text-white/40">This creator hasn't published any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {creator.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
