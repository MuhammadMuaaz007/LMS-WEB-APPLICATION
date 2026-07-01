"use client";
import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";

import {
  useGetOrderAnalyticsQuery,
  useGetUserAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import OrdersAnalytics from "../Analytics/OrderAnalytics";
import AllInvoices from "../Order/AllInvoices";

type Props = {
  open?: boolean;
  value?: number;
};

const getProgressValue = (currentMonth?: number, previousMonth?: number) => {
  const current = currentMonth ?? 0;
  const previous = previousMonth ?? 0;

  if (!current && !previous) {
    return 0;
  }

  if (!previous) {
    return current > 0 ? 100 : 0;
  }

  return Math.min(Math.max((current / previous) * 100, 0), 100);
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        // Utilizing clear, professional theme variants
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justify: "center",
        }}
      />
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [userComparePercentage, setuserComparePercentage] = useState<any>();

  const { data, isLoading } = useGetUserAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrderAnalyticsQuery({});

  useEffect(() => {
    if (isLoading || ordersLoading) {
      return;
    } else {
      if (data && ordersData) {
        const usersLastTwoMonths = data.users?.last12Months?.slice(-2) || [];
        const ordersLastTwoMonths =
          ordersData.orders?.last12Months?.slice(-2) || [];

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange =
            usersPreviousMonth !== 0
              ? ((usersCurrentMonth - usersPreviousMonth) /
                  usersPreviousMonth) *
                100
              : 100;

          const ordersPercentChange =
            ordersPreviousMonth !== 0
              ? ((ordersCurrentMonth - ordersPreviousMonth) /
                  ordersPreviousMonth) *
                100
              : 100;

          setuserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="mt-[100px] min-h-screen px-4 md:px-8 bg-transparent font-Poppins">
      {/* TOP CHART AND SUMMARY WIDGET CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-[68%,32%] gap-6 mt-8">
        <div className="w-full bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md p-2">
          <UserAnalytics isDashboard={true} />
        </div>

        {/* SIDE BAR WIDGET CARDS CONTAINER */}
        <div className="flex flex-col md:flex-row lg:flex-col justify-between items-center gap-6 w-full">
          {/* SALES OBTAINED CARD */}
          <div className="w-full bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-between">
            <div>
              <div className="bg-teal-500/10 p-3 rounded-xl w-fit">
                <BiBorderLeft className="text-[#37a39a] text-[26px]" />
              </div>
              <h5 className="pt-4 font-semibold text-slate-800 dark:text-gray-100 text-[22px] tracking-tight">
                {ordersComparePercentage?.currentMonth ?? 0}
              </h5>
              <h5 className="pt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                Sales Obtained
              </h5>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CircularProgressWithLabel
                value={getProgressValue(
                  ordersComparePercentage?.currentMonth,
                  ordersComparePercentage?.previousMonth,
                )}
                open={open}
              />
              <h5
                className={`text-center pt-3 text-sm font-semibold ${ordersComparePercentage?.percentChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}
              >
                {ordersComparePercentage?.percentChange >= 0
                  ? `+${ordersComparePercentage?.percentChange.toFixed(2)}%`
                  : `${ordersComparePercentage?.percentChange.toFixed(2)}%`}
              </h5>
            </div>
          </div>

          {/* NEW USERS CARD */}
          <div className="w-full bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-between">
            <div>
              <div className="bg-indigo-500/10 p-3 rounded-xl w-fit">
                <PiUsersFourLight className="text-[#4d62d9] text-[26px]" />
              </div>
              <h5 className="pt-4 font-semibold text-slate-800 dark:text-gray-100 text-[22px] tracking-tight">
                {userComparePercentage?.currentMonth ?? 0}
              </h5>
              <h5 className="pt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                New Users
              </h5>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CircularProgressWithLabel
                value={getProgressValue(
                  userComparePercentage?.currentMonth,
                  userComparePercentage?.previousMonth,
                )}
                open={open}
              />
              <h5
                className={`text-center pt-3 text-sm font-semibold ${userComparePercentage?.percentChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}
              >
                {userComparePercentage?.percentChange >= 0
                  ? `+${userComparePercentage?.percentChange.toFixed(2)}%`
                  : `${userComparePercentage?.percentChange.toFixed(2)}%`}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[68%,32%] gap-6 mt-8">
        <div className="w-full bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md p-2">
          <OrdersAnalytics isDashboard={true} />
        </div>

        <div className="bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md">
          <h5 className="text-slate-800 dark:text-gray-100 text-[18px] font-semibold tracking-tight pb-4">
            Recent Transactions
          </h5>
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            <AllInvoices isDashboard={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
