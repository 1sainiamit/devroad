import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { EditorForm } from "@/components/products/editor-form";
import { PublishButton } from "@/components/products/publish-button";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Use findFirst because we are querying by id AND creatorId (which isn't a unique compound index)
  const product = await prisma.product.findFirst({
    where: { 
      id: id,
      creatorId: user.id // Ensure they own it!
    },
    include: {
      files: true // Fetch the uploaded digital files
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 -ml-2 text-muted-foreground hover:text-black">
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Products
              </Link>
            </Button>
            <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              product.status === "PUBLISHED" ? "text-green-600 bg-green-100" : "text-amber-600 bg-amber-100"
            }`}>
              {product.status}
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Edit Product</h1>
          <p className="text-muted-foreground mt-1 font-medium">Upload files and customize your product page.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {product.status === "PUBLISHED" && (
            <Button asChild className="bg-white text-black border-2 border-black hover:bg-muted font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <a href={`/${product.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Storefront
              </a>
            </Button>
          )}
          <PublishButton productId={product.id} currentStatus={product.status} />
        </div>
      </div>
      
      {/* Client Component handles the heavy lifting */}
      <EditorForm product={product} />
    </div>
  );
}
