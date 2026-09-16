import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch order items to calculate revenue and sales
  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        creatorId: user.id,
      },
      order: {
        status: "PAID",
      },
    },
  });

  let totalRevenue = 0;
  let totalSales = 0;

  orderItems.forEach((item) => {
    totalRevenue += item.price * item.quantity;
    totalSales += item.quantity;
  });

  return (
    <DashboardClient
      totalRevenue={totalRevenue}
      totalSales={totalSales}
    />
  );
}
