import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockSales = [
  { id: "1", customer: "alice@example.com", product: "GumroadClone Template", date: "Oct 24, 2026", amount: "$49.00", status: "Paid" },
  { id: "2", customer: "bob@example.com", product: "Advanced Next.js Guide", date: "Oct 23, 2026", amount: "$15.00", status: "Paid" },
  { id: "3", customer: "charlie@example.com", product: "GumroadClone Template", date: "Oct 21, 2026", amount: "$49.00", status: "Refunded" },
  { id: "4", customer: "diana@example.com", product: "UI Kit Vol 1", date: "Oct 20, 2026", amount: "$29.00", status: "Paid" },
];

export default function SalesPage() {
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
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-b-2 border-black hover:bg-transparent">
                <TableHead className="font-bold text-black h-12 px-4">Customer</TableHead>
                <TableHead className="font-bold text-black h-12">Product</TableHead>
                <TableHead className="font-bold text-black h-12">Date</TableHead>
                <TableHead className="font-bold text-black h-12 text-right">Amount</TableHead>
                <TableHead className="font-bold text-black h-12 text-right px-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map((sale) => (
                <TableRow key={sale.id} className="border-b border-black/10 hover:bg-accent/50 cursor-pointer">
                  <TableCell className="font-medium px-4 py-4">{sale.customer}</TableCell>
                  <TableCell className="font-bold">{sale.product}</TableCell>
                  <TableCell className="text-muted-foreground">{sale.date}</TableCell>
                  <TableCell className="text-right font-black">{sale.amount}</TableCell>
                  <TableCell className="text-right px-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-sm border-2 border-black ${sale.status === 'Paid' ? 'bg-green-400 text-black' : 'bg-destructive text-white'}`}>
                      {sale.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
