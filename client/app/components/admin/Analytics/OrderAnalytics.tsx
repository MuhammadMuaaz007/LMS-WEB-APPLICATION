"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetOrderAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({ isDashboard }: Props) {
  // 1. Fetch live backend orders data
  const { data, isLoading } = useGetOrderAnalyticsQuery({});
console.log("OrdersAnalytics - data:", data);
  const analyticsData: { name: string; Count: number }[] = [];


  if (data && data.orders?.last12Months) {
    data.orders.last12Months.forEach((item: any) => {
      // Mapping 'item.month' or 'item.name' (matching your exact API field context)
      analyticsData.push({ name: item.month || item.name, Count: item.count });
    });
  }
  // const analyticsData = [
  //   {
  //     name: "Page A",
  //     Count: 4000,
  //   },
  //   {
  //     name: "Page B",
  //     Count: 3000,
  //   },
  //   {
  //     name: "Page C",
  //     Count: 5000,
  //   },
  //   {
  //     name: "Page D",
  //     Count: 1000,
  //   },
  //   {
  //     name: "Page E",
  //     Count: 4000,
  //   },
  //   {
  //     name: "Page F",
  //     Count: 800,
  //   },
  //   {
  //     name: "Page G",
  //     Count: 200,
  //   },
  // ];
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className={`w-full ${isDashboard ? "min-h-auto" : "min-h-screen"} bg-transparent p-4 sm:p-6 font-Poppins`}
    >
      {/* THEME HEADER SECTION */}
      {!isDashboard && (
        <div className="mt-8 md:mt-12 mb-8 max-w-[850px] mx-auto w-full">
          <h1 className="text-[22px] md:text-[26px] font-semibold text-slate-800 dark:text-gray-100 transition-colors">
            Orders Analytics
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1 transition-colors">
            Last 12 months analytics data
          </p>
        </div>
      )}

      {/* MATCHING COMPONENT THEME CONTAINER CARD */}
      <div
        className={`w-full max-w-[850px] mx-auto bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md ${isDashboard ? "h-[350px]" : "h-[400px]"} flex items-center justify-center overflow-hidden`}
      >
        {/* RESPONSIVE CONTAINER & ADJUSTED LAYOUT PER INTENDED DESIGN */}
        <ResponsiveContainer
          width={isDashboard ? "120%" : "110%"}
          height={!isDashboard ? "50%" : "100%"}
        >
          <LineChart
            data={analyticsData}
            margin={{ top: 30, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.1)"
            />

            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              dy={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tickCount={4}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
            {!isDashboard && <Legend />}

            <Line
              type="monotone"
              dataKey="Count"
              stroke="#37a39a"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
