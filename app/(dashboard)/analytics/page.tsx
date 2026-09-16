import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Package } from "lucide-react";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all order items where the product belongs to the current user, and the order is PAID
  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        creatorId: user.id,
      },
      order: {
        status: "PAID",
      },
    },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
  });

  // Calculate aggregations
  let totalRevenue = 0;
  let totalSalesCount = 0;
  const salesByProduct: Record<string, { name: string; revenue: number; sales: number }> = {};

  orderItems.forEach((item) => {
    const revenue = item.price * item.quantity;
    totalRevenue += revenue;
    totalSalesCount += item.quantity;

    if (!salesByProduct[item.productId]) {
      salesByProduct[item.productId] = {
        name: item.product.name,
        revenue: 0,
        sales: 0,
      };
    }

    salesByProduct[item.productId].revenue += revenue;
    salesByProduct[item.productId].sales += item.quantity;
  });

  // Prepare data for the chart (top 10 products by revenue)
  const chartData = Object.values(salesByProduct)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      Revenue: item.revenue, // Convert to rupees if needed, but it's already in rupees
      Sales: item.sales,
    }));

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-4 flex items-center gap-4">
          <BarChart3 className="w-10 h-10" />
          Sales Analytics
        </h1>
        <p className="text-xl font-bold text-muted-foreground">
          Track your revenue, sales volume, and product performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#ff90e8] border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Total Revenue</h3>
          </div>
          <p className="text-4xl font-black">₹{totalRevenue}</p>
        </div>

        <div className="bg-yellow-300 border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Total Sales</h3>
          </div>
          <p className="text-4xl font-black">{totalSalesCount}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border-4 border-black rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black mb-6">Revenue by Product</h2>

        {chartData.length > 0 ? (
          <div className="h-[400px] w-full">
            <AnalyticsChart data={chartData} />
          </div>
        ) : (
          <div className="h-[300px] w-full flex flex-col items-center justify-center border-4 border-dashed border-black/20 rounded-xl bg-muted/50">
            <BarChart3 className="w-12 h-12 text-black/20 mb-4" />
            <p className="text-lg font-bold text-muted-foreground">No sales data to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
