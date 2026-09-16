import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReceiptButton } from "@/components/sales/receipt-button";

export default async function SalesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        creatorId: user.id
      }
    },
    include: {
      order: {
        include: {
          buyer: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const sales = orderItems.map(item => {
    const amountInRupees = item.price * item.quantity;
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amountInRupees);

    const formattedUnitPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(item.price);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(item.createdAt);

    return {
      id: item.id,
      orderId: item.orderId,
      customerName: item.order.buyer.name || "Customer",
      customerEmail: item.order.buyer.email,
      product: item.productName,
      quantity: item.quantity.toString(),
      unitPrice: formattedUnitPrice,
      date: formattedDate,
      amount: formattedAmount,
      numericAmount: amountInRupees,
      status: item.order.status,
      paymentId: item.order.razorpayPaymentId,
      creatorName: user.name || "Creator",
      creatorEmail: user.email
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Sales</h1>
          <p className="text-muted-foreground mt-1 font-medium">View and manage your recent transactions.</p>
        </div>
        <Button variant="outline" className="border-2 border-black h-12 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 font-bold">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-white">
        <CardHeader className="border-b-2 border-black pb-4">
          <CardTitle className="font-black text-xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sales.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p className="font-medium text-lg">No sales yet.</p>
              <p className="text-sm">Share your products to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-b-2 border-black hover:bg-transparent">
                  <TableHead className="font-bold text-black h-12 px-4">Customer</TableHead>
                  <TableHead className="font-bold text-black h-12">Product</TableHead>
                  <TableHead className="font-bold text-black h-12">Date</TableHead>
                  <TableHead className="font-bold text-black h-12 text-right">Amount</TableHead>
                  <TableHead className="font-bold text-black h-12 text-right px-4">Status</TableHead>
                  <TableHead className="font-bold text-black h-12 text-right px-4">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id} className="border-b border-black/10 hover:bg-accent/50 cursor-pointer">
                    <TableCell className="font-medium px-4 py-4">{sale.customerEmail}</TableCell>
                    <TableCell className="font-bold">{sale.product}</TableCell>
                    <TableCell className="text-muted-foreground">{sale.date}</TableCell>
                    <TableCell className="text-right font-black">{sale.amount}</TableCell>
                    <TableCell className="text-right px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-sm border-2 border-black ${
                        sale.status === 'PAID' ? 'bg-green-400 text-black' : 
                        sale.status === 'REFUNDED' ? 'bg-yellow-400 text-black' :
                        sale.status === 'PENDING' ? 'bg-gray-200 text-black' :
                        'bg-destructive text-white'
                      }`}>
                        {sale.status === 'PAID' ? 'Paid' : sale.status === 'REFUNDED' ? 'Refunded' : sale.status === 'PENDING' ? 'Pending' : 'Failed'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-4">
                      <ReceiptButton sale={sale} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
