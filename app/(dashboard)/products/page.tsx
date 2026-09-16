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
        <div className="grid gap-4">
          {products.data?.map((product) => (
            <Link key={product.id} href={`/products/${product.id}/edit`}>
              <Card className="flex items-center p-4 gap-4 bg-white hover:bg-accent/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-muted border-2 border-black rounded-sm flex items-center justify-center shrink-0 overflow-hidden relative">
                  {product.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.coverImageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate group-hover:underline">{product.name}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{product.description || "Digital Download"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-black text-lg">₹{product.price}</div>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${product.status === "PUBLISHED" ? "text-green-600 bg-green-100" : "text-amber-600 bg-amber-100"
                      }`}>
                      {product.status}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-black hover:text-white rounded-full">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
