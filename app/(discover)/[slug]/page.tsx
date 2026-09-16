import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { BuyButton } from "@/components/storefront/buy-button";
import { User, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Only allow viewing if published, or if the current user is the creator
  if (product.status !== "PUBLISHED" && product.creator.id !== user?.id) {
    notFound();
  }

  const creatorName = product.creator.name || product.creator.username || "Anonymous";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Left Column: Image and Description */}
        <div className="flex-1 space-y-8">
          <div className="aspect-[4/3] md:aspect-video lg:aspect-[4/3] w-full bg-[#f4f4f0] rounded-lg relative overflow-hidden flex items-center justify-center p-8">
            {product.coverImageUrl ? (
              <div className="relative w-full h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <Image
                  src={product.coverImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="text-black/40 font-medium text-xl">
                No cover image
              </div>
            )}
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <h2 className="text-3xl font-medium mb-4">About this product</h2>
            {product.description ? (
              <div className="whitespace-pre-wrap font-medium text-white/80 leading-relaxed">
                {product.description}
              </div>
            ) : (
              <p className="text-white/50 italic">No description provided.</p>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Sidebar */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-24 space-y-6">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
              {product.name}
            </h1>

            <Link href={`/creator/${product.creator.username || product.creator.id}`} className="flex items-center gap-3 pb-6 border-b border-white/10 group">
              {product.creator.avatarUrl ? (
                <Image
                  src={product.creator.avatarUrl}
                  alt={creatorName}
                  width={40}
                  height={40}
                  className="rounded-full border border-white/20 group-hover:border-white/50 transition-colors"
                />
              ) : (
                <div className="w-10 h-10 bg-white/10 rounded-full text-white flex items-center justify-center border border-white/20 group-hover:border-white/50 transition-colors">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="font-medium text-lg underline underline-offset-4 decoration-white/40 group-hover:decoration-white cursor-pointer transition-colors">
                {creatorName}
              </div>
            </Link>

            <div className="space-y-4 pt-2">
              <BuyButton
                product={{
                  id: product.id,
                  name: product.name,
                  priceInCents: product.priceInCents,
                  currency: product.currency,
                  coverImageUrl: product.coverImageUrl,
                  creatorName: creatorName,
                  slug: product.slug,
                }}
              />

              <div className="flex items-center justify-center gap-2 text-sm font-medium text-white/60 pt-4">
                <ShieldCheck className="w-4 h-4 text-white/60" />
                Secure transaction
              </div>
            </div>

            {product.status !== "PUBLISHED" && (
              <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl font-medium text-amber-500 text-center text-sm">
                This product is currently in DRAFT mode and only visible to you.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
