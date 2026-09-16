import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FileList } from "@/components/library/file-list";
import { RatingWidget } from "@/components/library/rating-widget";

export default async function ProductDownloadPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Verify the user actually purchased this product
  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId: productId,
      order: {
        buyerId: user.id,
        status: "PAID",
      },
    },
  });

  if (!purchase) {
    notFound();
  }

  // Fetch the product details and its files
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      creator: {
        select: {
          name: true,
          username: true,
        },
      },
      files: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch the user's existing review if any
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId: productId
      }
    }
  });

  const creatorName = product.creator.name || product.creator.username || "Anonymous";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-black">
      <Link href="/library" className="inline-flex items-center gap-2 text-muted-foreground hover:text-black font-bold mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Library
      </Link>

      <div className="bg-white border-4 border-black rounded-2xl overflow-hidden mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="aspect-[21/9] w-full bg-muted relative border-b-4 border-black">
          {product.coverImageUrl && (
            <Image
              src={product.coverImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-black mb-2 text-black">{product.name}</h1>
            <p className="text-muted-foreground font-bold text-lg">by {creatorName}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="prose max-w-none mb-10 text-black font-medium">
            <h2 className="text-2xl font-black mb-4">Product Description</h2>
            <div className="whitespace-pre-wrap">{product.description || "No description provided."}</div>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-4">Downloads</h2>
            <FileList files={product.files.map(f => ({
              ...f,
              sizeInBytes: Number(f.sizeInBytes)
            }))} />
          </div>

          <div className="mt-12">
            <RatingWidget 
              productId={productId} 
              initialRating={existingReview?.rating} 
              initialComment={existingReview?.comment} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
