import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PackageOpen, MoreHorizontal, FileText } from "lucide-react";
import { getProducts } from "@/app/actions/products";
import Link from "next/link";

export default async function ProductsPage() {
  // Static state for now
  const products = await getProducts();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Products</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage your digital products and memberships.</p>
        </div>
        <Button asChild className="bg-primary text-black hover:bg-primary/90 h-12 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
          <Link href="/products/new">
            <Plus className="w-5 h-5" />
            New Product
          </Link>
        </Button>
      </div>

      {!products.success ? (
        <Card className="border-2 border-black bg-destructive/10 p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-black text-destructive mb-2">Oops! Something went wrong.</h3>
          <p className="text-destructive font-medium">{products.message}</p>
        </Card>
      ) : products.data?.length === 0 ? (
        <Card className="border-dashed border-4 border-black/20 bg-transparent flex flex-col items-center justify-center py-24 text-center">
          <PackageOpen className="w-16 h-16 text-black/20 mb-4" />
          <h3 className="text-2xl font-black mb-2">No products yet</h3>
          <p className="text-muted-foreground font-medium mb-6 max-w-sm">
            Create your first digital product to start selling to your audience.
          </p>
          <Button asChild className="bg-black text-white hover:bg-black/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            <Link href="/products/new">
              Create Product
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.data?.map((product) => (
            <Link key={product.id} href={`/products/${product.id}/edit`} className="group block">
              <Card className="h-full flex flex-col border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all bg-white overflow-hidden cursor-pointer">
                {/* Image Section */}
                <div className="aspect-[16/10] bg-[#f4f4f0] border-b-2 border-black relative overflow-hidden">
                  {product.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.coverImageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-black/20" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${product.status === "PUBLISHED" ? "bg-[#bbf7d0] text-black" : "bg-[#fde047] text-black"}`}>
                    {product.status}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-black text-xl line-clamp-1 group-hover:underline">{product.name}</h3>
                    <div className="font-black text-xl shrink-0">₹{product.price}</div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground line-clamp-2 mb-4">
                    {product.description || "Digital Download"}
                  </p>
                  
                  {/* Footer / Actions */}
                  <div className="mt-auto pt-4 border-t-2 border-black/10 flex justify-between items-center text-sm font-bold text-black/60 group-hover:text-black transition-colors">
                    <span className="flex items-center gap-1.5"><MoreHorizontal className="w-4 h-4"/> Manage Product</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
