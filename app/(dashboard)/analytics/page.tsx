"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, MousePointerClick, Eye, CreditCard } from "lucide-react";

const revenueData = [
  { name: "Mon", revenue: 120, views: 300 },
  { name: "Tue", revenue: 250, views: 450 },
  { name: "Wed", revenue: 180, views: 380 },
  { name: "Thu", revenue: 320, views: 600 },
  { name: "Fri", revenue: 450, views: 800 },
  { name: "Sat", revenue: 390, views: 750 },
  { name: "Sun", revenue: 500, views: 900 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">Analytics</h1>
        <p className="text-muted-foreground mt-1 font-medium">Deep dive into your store's performance.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              Total Revenue
              <CreditCard className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">$2,210</div>
            <p className="text-sm font-bold flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-700" />
              +12.5% this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#a6e3a1] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              Store Views
              <Eye className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">4,180</div>
            <p className="text-sm font-bold flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-700" />
              +24% this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#89b4fa] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              Conversion Rate
              <MousePointerClick className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">3.2%</div>
            <p className="text-sm font-bold flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-700" />
              +0.4% this week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none p-2">
        <CardHeader>
          <CardTitle className="font-black text-xl">Revenue vs Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#000" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ strokeWidth: 2, stroke: '#000' }}
                  fontFamily="inherit"
                  fontWeight="bold"
                />
                <YAxis
                  yAxisId="left"
                  stroke="#000"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ strokeWidth: 2, stroke: '#000' }}
                  tickFormatter={(value) => `$${value}`}
                  fontFamily="inherit"
                  fontWeight="bold"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#000"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="inherit"
                  fontWeight="bold"
                />
                <Tooltip 
                  cursor={{stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2}}
                  contentStyle={{ 
                    borderRadius: '0px', 
                    border: '2px solid black',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                    fontWeight: 'bold',
                    backgroundColor: 'white'
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  activeDot={{ r: 8, stroke: 'black', strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="views" 
                  stroke="#89b4fa" 
                  strokeWidth={4}
                  activeDot={{ r: 8, stroke: 'black', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
