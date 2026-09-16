"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, ArrowUpRight, DollarSign, Users, CreditCard, CheckCircle2, Circle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface DashboardClientProps {
  totalRevenue: number;
  totalSales: number;
  revenueByDay: { name: string; total: number }[];
  totalViews: number;
  setup: {
    hasProfile: boolean;
    hasProduct: boolean;
    hasPayout: boolean;
  };
}

export function DashboardClient({ totalRevenue, totalSales, revenueByDay, totalViews, setup }: DashboardClientProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Welcome back, {user?.name?.split(' ')[0] || 'Creator'}</h1>
          <p className="text-muted-foreground mt-1 font-medium">Here's what's happening with your store today.</p>
        </div>
        <Button asChild className="bg-primary text-black hover:bg-primary/90 h-12 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
          <Link href="/products/new">
            <Plus className="w-5 h-5" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">₹{totalRevenue}</div>
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalSales}</div>
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">0</div>
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-1">
              <span className="w-3 h-3 inline-block" />
              No active members
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Store Views</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalViews.toLocaleString('en-IN')}</div>
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-1">
              <span className="w-3 h-3 inline-block" />
              {totalViews === 0 ? "No views yet" : "Across all your products"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area (Chart + Checklist) */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="font-black text-xl">Revenue Overview <span className="text-sm font-medium text-muted-foreground ml-1">(last 7 days)</span></CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    fontFamily="inherit"
                    fontWeight="bold"
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                    fontFamily="inherit"
                    fontWeight="bold"
                  />
                  <RechartsTooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '2px solid black',
                      boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                      fontWeight: 'bold'
                    }}
                    formatter={(value) => [`₹${typeof value === 'number' ? value.toLocaleString('en-IN') : value}`, 'Revenue']}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    stroke="black"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card className="bg-accent h-fit">
          <CardHeader>
            <CardTitle className="font-black text-xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              {/* Step 1 — Profile */}
              <Link href="/settings" className="flex items-start gap-3 group">
                {setup.hasProfile
                  ? <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                  : <Circle className="w-5 h-5 mt-0.5 text-black/30 flex-shrink-0" />}
                <div className="flex flex-col">
                  <span className={`font-bold group-hover:underline ${setup.hasProfile ? "line-through text-black/40" : ""}`}>
                    Customize your profile
                  </span>
                  <span className="text-sm text-black/70 font-medium">
                    {setup.hasProfile ? "Profile complete ✓" : "Add a photo and bio to build trust."}
                  </span>
                </div>
              </Link>

              {/* Step 2 — Product */}
              <Link href={setup.hasProduct ? "/products" : "/products/new"} className="flex items-start gap-3 group">
                {setup.hasProduct
                  ? <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                  : <Circle className="w-5 h-5 mt-0.5 text-black/30 flex-shrink-0" />}
                <div className="flex flex-col">
                  <span className={`font-bold group-hover:underline ${setup.hasProduct ? "line-through text-black/40" : ""}`}>
                    Create a product
                  </span>
                  <span className="text-sm text-black/70 font-medium">
                    {setup.hasProduct ? "At least one product exists ✓" : "Upload your first digital file."}
                  </span>
                </div>
              </Link>

              {/* Step 3 — Payout */}
              <Link href="/payouts" className="flex items-start gap-3 group">
                {setup.hasPayout
                  ? <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                  : <Circle className="w-5 h-5 mt-0.5 text-black/30 flex-shrink-0" />}
                <div className="flex flex-col">
                  <span className={`font-bold group-hover:underline ${setup.hasPayout ? "line-through text-black/40" : ""}`}>
                    Connect payout
                  </span>
                  <span className="text-sm text-black/70 font-medium">
                    {setup.hasPayout ? "Bank account connected ✓" : "Add your bank to get paid."}
                  </span>
                </div>
              </Link>
            </div>

            {/* Progress bar */}
            {(() => {
              const done = [setup.hasProfile, setup.hasProduct, setup.hasPayout].filter(Boolean).length;
              const allDone = done === 3;
              return (
                <>
                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>{done} / 3 complete</span>
                      {allDone && <span className="text-green-600">All done! 🎉</span>}
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(done / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full mt-4 bg-black text-white hover:bg-black/90 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all"
                  >
                    <Link href={
                      allDone ? "/discover" :
                      !setup.hasProfile ? "/settings" :
                      !setup.hasProduct ? "/products/new" :
                      "/payouts"
                    }>
                      {allDone ? "View your store" :
                       !setup.hasProfile ? "Complete your profile →" :
                       !setup.hasProduct ? "Create a product →" :
                       "Connect payout →"}
                    </Link>
                  </Button>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}