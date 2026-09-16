import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

interface LibraryCardProps {
  product: {
    id: string;
    name: string;
    coverImageUrl: string | null;
    creator: {
      name: string | null;
      username: string | null;
    };
  };
}

export function LibraryCard({ product }: LibraryCardProps) {
  const creatorName = product.creator.name || product.creator.username || "Anonymous";

  return (
    <Link href={`/library/${product.id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white border-4 border-black rounded-xl overflow-hidden hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
        
        {/* Image Container */}
        <div className="aspect-[4/3] w-full bg-muted relative border-b-4 border-black overflow-hidden">
          {product.coverImageUrl ? (
            <Image
              src={product.coverImageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium">
              No cover
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-black line-clamp-1 group-hover:underline">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm font-bold mt-1">
                by {creatorName}
              </p>
            </div>
          </div>
          
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-2 text-sm font-black text-primary">
              <Download className="w-4 h-4" />
              View Content
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
