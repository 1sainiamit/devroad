import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile for checklist
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { avatarUrl: true, bio: true, razorpayAccountId: true },
  });

  // Check if creator has any products
  const productCount = await prisma.product.count({
    where: { creatorId: user.id },
  });

  const setup = {
    hasProfile: !!(dbUser?.avatarUrl || dbUser?.bio),
    hasProduct: productCount > 0,
    hasPayout: !!dbUser?.razorpayAccountId,
  };

  // Sum view counts across all creator's products
  const viewAggregate = await prisma.product.aggregate({
    where: { creatorId: user.id },
    _sum: { viewCount: true },
  });
  const totalViews = viewAggregate._sum.viewCount ?? 0;

  // Build last 7 days window
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Fetch order items with their order date
  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: { creatorId: user.id },
      order: { status: "PAID" },
    },
    include: {
      order: { select: { createdAt: true } },
    },
  });

  let totalRevenue = 0;
  let totalSales = 0;

  orderItems.forEach((item) => {
    totalRevenue += item.price * item.quantity;
    totalSales += item.quantity;
  });

  // Build revenue per day for the last 7 days
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueMap: Record<string, number> = {};

  // Initialise all 7 days to 0 in chronological order
  const orderedDays: { label: string; dateStr: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const label = DAY_LABELS[d.getDay()];
    revenueMap[dateStr] = 0;
    orderedDays.push({ label, dateStr });
  }

  // Accumulate real revenue per day
  orderItems.forEach((item) => {
    const dateStr = item.order.createdAt.toISOString().slice(0, 10);
    if (dateStr in revenueMap) {
      revenueMap[dateStr] += item.price * item.quantity;
    }
  });

  const revenueByDay = orderedDays.map(({ label, dateStr }) => ({
    name: label,
    total: revenueMap[dateStr],
  }));

  return (
    <DashboardClient
      totalRevenue={totalRevenue}
      totalSales={totalSales}
      revenueByDay={revenueByDay}
      setup={setup}
      totalViews={totalViews}
    />
  );
}
