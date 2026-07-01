"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCourseAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

const CourseAnalytics = () => {
  const { data, isLoading } = useGetCourseAnalyticsQuery({});

  // const analyticsData: { name: string; uv: number }[] = [];

  // if (data && data.courses?.last12Months) {
  //   data.courses.last12Months.forEach((item: any) => {
  //     analyticsData.push({ name: item.month, uv: item.count });
  //   });
  // }


  const analyticsData = [
    { name: "Jun 2023", uv: 3 },
    { name: "July 2023", uv: 2 },
    { name: "August 2023", uv: 5 },
    { name: "Sept 2023", uv: 7 },
    { name: "October 2023", uv: 2 },
    { name: "Nov 2023", uv: 5 },
    { name: "December 2023", uv: 7 },
  ];
  if (isLoading) {
    return <Loader />;
  }

  const minValue = 0;

  return (
    <div className="w-full min-h-screen bg-transparent p-4 sm:p-6 font-Poppins">
      {/* HEADER SECTION */}
      <div className="mt-8 md:mt-12 mb-8 max-w-[850px] mx-auto w-full">
        <h1 className="text-[22px] md:text-[26px] font-semibold text-slate-800 dark:text-gray-100 transition-colors">
          Courses Analytics
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1 transition-colors">
          Last 12 months analytics data
        </p>
      </div>

      {/* CHART CONTAINER */}
      <div className="w-full max-w-[850px] mx-auto bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md h-[400px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData}
            margin={{ top: 30, right: 10, left: -20, bottom: 10 }}
          >
            <XAxis
              dataKey="name"
              axisLine={true}
              tickLine={true}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              dy={10}
            >
              <Label offset={0} position="insideBottom" />
            </XAxis>
            <YAxis
              domain={[minValue, "auto"]}
              axisLine={true}
              tickLine={true}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(55, 163, 154, 0.05)" }}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
     
            <Bar
              dataKey="uv"
              fill="#37a39a"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            >
              <LabelList
                dataKey="uv"
                position="top"
                fill="#64748b"
                fontSize={12}
                fontWeight={600}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CourseAnalytics;
