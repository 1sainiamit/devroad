import Link from "next/link";
import Image from "next/image";
import { User, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    name: string;
    slug: string;
    priceInCents: number;
    currency: string;
    coverImageUrl: string | null;
    creator: {
      name: string | null;
      username: string | null;
      avatarUrl: string | null;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "USD",
    minimumFractionDigits: 0,
  }).format(product.priceInCents / 100);

  const creatorName = product.creator.name || product.creator.username || "Anonymous";

  return (
    <Link
      href={`/${product.slug}`}
      className="group block bg-black border border-[#333] rounded-md overflow-hidden transition-colors hover:border-white/30 flex flex-col h-full"
    >
      {/* Image Container (Light Background) */}
      <div className="aspect-[4/5] w-full bg-[#f4f4f0] relative overflow-hidden flex-shrink-0 flex items-center justify-center p-8">
        {product.coverImageUrl ? (
          <div className="relative w-full h-full shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <Image
              src={product.coverImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-black/5 flex items-center justify-center border border-black/10">
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
          
          {/* Mock Rating Row */}
          <div className="flex items-center gap-1.5 text-white/90 font-medium text-lg">
            <Star className="w-5 h-5 fill-white text-white" />
            <span>4.9</span>
            <span className="text-white/60 text-base font-normal ml-1">(451)</span>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-[#333]" />

      {/* Price Row */}
      <div className="p-5 bg-black">
        <div 
          className="inline-block bg-[#ff90e8] text-black font-medium text-xl px-5 py-2"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 75% 50%, 100% 100%, 0% 100%)" }}
        >
          {product.priceInCents === 0 ? "Free+" : `${formattedPrice}+`}
        </div>
      </div>
    </Link>
  );
}
