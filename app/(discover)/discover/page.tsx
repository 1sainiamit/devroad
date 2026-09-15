import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/products/product-card";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { creator: { username: { contains: query, mode: "insensitive" } } },
              { creator: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      creator: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-transparent">

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white">
            {query ? `Search results for "${query}"` : "Trending Products"}
          </h2>
          <div className="text-white/70 font-medium">
            {products.length} {products.length === 1 ? "product" : "products"}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-black/20 border-4 border-dashed border-white/20 rounded-3xl">
            <h3 className="text-2xl font-bold mb-2 text-white">No products found</h3>
            <p className="text-white/70">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}