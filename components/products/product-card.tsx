import Link from "next/link";
import Image from "next/image";
import { User, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    name: string;
    slug: string;
    price: number;
    currency: string;
    coverImageUrl: string | null;
    averageRating: number;
    reviewCount: number;
    creator: {
      name: string | null;
      username: string | null;
      avatarUrl: string | null;
    };
    isCreator?: boolean;
    isOwned?: boolean;
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.currency || "INR",
    minimumFractionDigits: 0,
  }).format(product.price);

  const creatorName = product.creator.name || product.creator.username || "Anonymous";

  return (
    <Link
      href={`/${product.slug}`}
      className="group block bg-black border border-[#333] rounded-md overflow-hidden transition-colors hover:border-white/30 flex flex-col h-full"
    >
      {/* Full-Width Image Container */}
      <div className="aspect-[16/10] w-full bg-[#f4f4f0] relative overflow-hidden flex-shrink-0">
        {product.coverImageUrl ? (
          <Image
            src={product.coverImageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="w-full h-full bg-black/5 flex items-center justify-center border-b border-black/10">
            <span className="text-black/40 font-medium">No cover</span>
          </div>
        )}
      </div>

      {/* Content Container (Dark Background) */}
      <div className="p-5 flex flex-col flex-grow bg-black text-white">
        <h3 className="font-medium text-xl leading-snug mb-4 group-hover:text-white/80 transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto space-y-4">
          {/* Creator Row */}
          <div className="flex items-center gap-3 text-sm">
            {product.creator.avatarUrl ? (
              <Image
                src={product.creator.avatarUrl}
                alt={creatorName}
                width={24}
                height={24}
                className="rounded-full border border-white/20"
              />
            ) : (
              <div className="w-6 h-6 bg-white/10 rounded-full text-white flex items-center justify-center border border-white/20">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="truncate font-medium underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors">
              {creatorName}
            </span>
          </div>

          {/* Real Rating Row */}
          <div className="flex items-center gap-1.5 text-white/90 font-medium text-lg">
            <Star className="w-5 h-5 fill-white text-white" />
            <span>{product.reviewCount > 0 ? product.averageRating.toFixed(1) : "New"}</span>
            {product.reviewCount > 0 && (
              <span className="text-white/60 text-base font-normal ml-1">({product.reviewCount})</span>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#333]" />

      {/* Price Row */}
      <div className="p-5 bg-black flex justify-between items-center">
        {product.isCreator ? (
          <div
            className="inline-block bg-white text-black font-bold text-lg px-4 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          >
            Your Product
          </div>
        ) : product.isOwned ? (
          <div
            className="inline-block bg-green-400 text-black font-bold text-lg px-4 py-1.5 border-2 border-green-400"
          >
            Purchased
          </div>
        ) : (
          <div
            className="inline-block bg-[#ff90e8] text-black font-medium text-xl px-5 py-2"
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 75% 50%, 100% 100%, 0% 100%)" }}
          >
            {product.price === 0 ? "Free+" : `${formattedPrice}+`}
          </div>
        )}
      </div>
    </Link>
  );
}