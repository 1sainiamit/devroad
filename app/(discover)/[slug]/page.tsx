import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { BuyButton } from "@/components/storefront/buy-button";
import { User, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug },
    include: { creator: true }
  });

  if (!product) {
    return { title: "Product Not Found" };
  }

  const creatorName = product.creator.name || product.creator.username || "Anonymous";
  const description = product.description?.substring(0, 160) || `Check out ${product.name} by ${creatorName} on Devroad.`;

  return {
    title: product.name,
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      images: product.coverImageUrl ? [product.coverImageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description,
      images: product.coverImageUrl ? [product.coverImageUrl] : [],
    },
  };
}

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
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
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

  // Increment view count — skip if the creator is viewing their own product
  if (product.status === "PUBLISHED" && product.creator.id !== user?.id) {
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  // Check if user has purchased this product
  let isOwned = false;
  if (user) {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId: product.id,
        order: {
          buyerId: user.id,
          status: "PAID"
        }
      }
    });
    isOwned = !!orderItem;
  }

  const isCreator = product.creator.id === user?.id;
  const creatorName = product.creator.name || product.creator.username || "Anonymous";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Left Column: Image, Description, and Reviews */}
        <div className="flex-1 space-y-8">
          {/* Full-Width Image Container */}
          <div className="aspect-[16/10] w-full bg-[#f4f4f0] rounded-lg relative overflow-hidden flex-shrink-0">
            {product.coverImageUrl ? (
              <Image
                src={product.coverImageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/40 font-medium text-xl border border-black/10">
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

          {/* Reviews Section */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-medium">Reviews</h2>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 text-white/60">
                  <Star className="w-5 h-5 fill-white text-white" />
                  <span className="text-lg font-medium text-white">
                    {product.averageRating.toFixed(1)}
                  </span>
                  <span className="text-base">
                    ({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
            </div>

            {product.reviews.length === 0 ? (
              <p className="text-white/50 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => {
                  const reviewerName = review.user.name || review.user.username || "Anonymous";
                  return (
                    <div
                      key={review.id}
                      className="p-5 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        {review.user.avatarUrl ? (
                          <Image
                            src={review.user.avatarUrl}
                            alt={reviewerName}
                            width={36}
                            height={36}
                            className="rounded-full border border-white/20 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/20 flex-shrink-0">
                            <User className="w-4 h-4 text-white/60" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-medium text-white truncate">
                              {reviewerName}
                            </span>
                            <span className="text-sm text-white/40 flex-shrink-0">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-white text-white"
                                    : "fill-transparent text-white/20"
                                }`}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              {isCreator ? (
                <Link href={`/dashboard/products/${product.id}`} className="block w-full">
                  <div className="w-full h-14 flex items-center justify-center text-lg font-bold bg-white text-black hover:bg-gray-200 transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    Edit Product
                  </div>
                </Link>
              ) : isOwned ? (
                <Link href={`/library`} className="block w-full">
                  <div className="w-full h-14 flex items-center justify-center text-lg font-bold bg-green-400 text-black hover:bg-green-500 transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    View Content
                  </div>
                </Link>
              ) : (
                <BuyButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    currency: product.currency,
                    coverImageUrl: product.coverImageUrl,
                    creatorName: creatorName,
                    slug: product.slug,
                  }}
                />
              )}

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