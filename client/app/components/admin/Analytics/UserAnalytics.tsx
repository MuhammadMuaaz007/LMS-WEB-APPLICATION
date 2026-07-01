"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Loader } from "../../Loader/Loader";
import { useGetUserAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {
  isDashboard?: boolean;
};

const UserAnalytics = ({ isDashboard }: Props) => {
  // Fetch real-time data using your User Analytics hook
  const { data, isLoading } = useGetUserAnalyticsQuery({});

  const analyticsData: { name: string; count: number }[] = [];

  // Map the backend data: item.month -> name, item.count -> count
  if (data && data.users?.last12Months) {
    data.users.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, count: item.count });
    });
  }
  // const analyticsData = [
  //   { name: "Jan 2023", count: 3 },
  //   { name: "Feb 2023", count: 2 },
  //   { name: "March 2023", count: 5 },
  //   { name: "April 2023", count: 7 },
  //   { name: "May 2023", count: 2 },
  //   { name: "June 2023", count: 5 },
  //   { name: "July 2023", count: 7 },
  //   { name: "August 2023", count: 4 },
  //   { name: "September 2023", count: 3 },
  //   { name: "October 2023", count: 8 },
  //   { name: "November 2023", count: 2 },
  // ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className={`w-full ${isDashboard ? "min-h-auto" : "min-h-screen"} bg-transparent p-4 sm:p-6 font-Poppins`}
    >
      {/* HEADER SECTION */}
      {!isDashboard && (
        <div className="mt-8 md:mt-12 mb-8 max-w-[850px] mx-auto w-full">
          <h1 className="text-[22px] md:text-[26px] font-semibold text-slate-800 dark:text-gray-100 transition-colors">
            Users Analytics
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1 transition-colors">
            Last 12 months analytics data
          </p>
        </div>
      )}

      {/* CHART CONTAINER */}
      <div
        className={`w-full max-w-[850px] mx-auto bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md ${isDashboard ? "h-[350px]" : "h-[400px]"} flex items-center justify-center overflow-hidden`}
      >
        <ResponsiveContainer
          width={isDashboard ? "120%" : "110%"}
          height={!isDashboard ? "50%" : "100%"}
        >
          <AreaChart
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
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
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

            <Area
              type="monotone"
              dataKey="count"
              stroke="#37a39a"
              strokeWidth={3}
              fill="rgba(55, 163, 154, 0.15)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserAnalytics;
