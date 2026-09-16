"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface AnalyticsChartProps {
  data: {
    name: string;
    Revenue: number;
    Sales: number;
  }[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => (value.length > 15 ? value.substring(0, 15) + '...' : value)}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '4px solid black', 
            borderRadius: '8px',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            fontWeight: 'bold'
          }}
          itemStyle={{ color: 'black' }}
        />
        <Bar 
          dataKey="Revenue" 
          fill="#ff90e8" 
          radius={[4, 4, 0, 0]} 
          stroke="black"
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
