"use client";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "../../../../redux/features/order/orderApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();
  const { data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});


  // ==========================================
  // TYPE 1: MOCK RANDOM DATA (CURRENTLY ACTIVE)
  // // ==========================================
  // const orderData = [
  //   {
  //     _id: "INV-8932",
  //     userName: "Alex Morgan",
  //     userEmail: "alex.m@gmail.com",
  //     title: "Fullstack Next.js Developer Bundle",
  //     price: "₹8,499",
  //     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  //   },
  //   {
  //     _id: "INV-4311",
  //     userName: "Sarah Jenkins",
  //     userEmail: "sarah.j@outlook.com",
  //     title: "MERN Stack Mastery Course",
  //     price: "₹4,999",
  //     createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  //   },
  //   {
  //     _id: "INV-0912",
  //     userName: "Rajesh Kumar",
  //     userEmail: "rajesh99@gmail.com",
  //     title: "UI/UX Design Essentials with Figma",
  //     price: "₹3,200",
  //     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  //   },
  //   {
  //     _id: "INV-7741",
  //     userName: "Emily Watson",
  //     userEmail: "emily.w@dev.io",
  //     title: "Tailwind CSS Advanced Layouts",
  //     price: "₹1,500",
  //     createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  //   },
  //   {
  //     _id: "INV-5523",
  //     userName: "Michael Chang",
  //     userEmail: "m.chang@tech.com",
  //     title: "TypeScript Deep Dive Architecture",
  //     price: "₹6,100",
  //     createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  //   },
  // ];

  // ==========================================
  // TYPE 2: REAL API DATA STATE & LOGIC (COMMENTED OUT)
  // ==========================================

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data && data.orders) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users?.find(
          (user: any) => user._id === item.userId,
        );
        const course = coursesData?.courses?.find(
          (course: any) => course._id === item.courseId,
        );
        return {
          ...item,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "N/A",
          title: course?.name || "Deleted Course",
          price: "$" + (course?.price || 0),
        };
      });

      setOrderData(temp || []);
    }
  }, [data, usersData, coursesData]);

  const columns: any = [
    { field: "id", headerName: "ID", flex: isDashboard ? 0.4 : 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.4 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
      : [
          {
            field: "emailAction",
            headerName: "Action",
            flex: 0.2,
            sortable: false,
            renderCell: (params: any) => {
              return (
                <div className="flex items-center h-full">
                  <a href={`mailto:${params.row.userEmail}`}>
                    <AiOutlineMail
                      className="text-slate-600 dark:text-gray-300 hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-colors"
                      size={20}
                    />
                  </a>
                </div>
              );
            },
          },
        ]),
  ];

  const rows: any = [];
  if (orderData) {
    orderData.forEach((item: any) => {
      rows.push({
        id: item._id,
        userName: item.userName,
        userEmail: item.userEmail,
        title: item.title,
        price: item.price,
        created_at: format(item.createdAt),
      });
    });
  }

  return (
    <div
      className={
        !isDashboard
          ? "w-full min-h-screen bg-transparent p-4 sm:p-6 font-Poppins mt-[80px]"
          : "w-full font-Poppins"
      }
    >
      {/* Set this to `isLoading` instead of `false` when running your live production endpoints */}
      {false ? (
        <Loader />
      ) : (
        <Box
          className={!isDashboard ? "max-w-[1100px] mx-auto w-full" : "w-full"}
        >
          {!isDashboard && (
            <div className="mb-6">
              <h1 className="text-[22px] md:text-[26px] font-semibold text-slate-800 dark:text-gray-100 transition-colors">
                Invoices & Transactions
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1 transition-colors">
                Overview of all recent course transactions
              </p>
            </div>
          )}

          <Box
            height={isDashboard ? "35vh" : "75vh"}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
                fontFamily: "Poppins, sans-serif",
                backgroundColor: theme === "dark" ? "#0b0c14" : "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                borderWidth: "1px",
                borderColor:
                  theme === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(226, 232, 240, 0.6)",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor:
                  theme === "dark"
                    ? "#111827 !important"
                    : "#f8fafc !important",
                borderBottom:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
              },
              "& .MuiDataGrid-columnHeader": {
                color:
                  theme === "dark"
                    ? "#5b6e93 !important"
                    : "#1e293b !important",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600 !important",
                color:
                  theme === "dark"
                    ? "#5b6e93 !important"
                    : "#1e293b !important",
              },
              "& .MuiDataGrid-menuIcon, & .MuiDataGrid-iconButtonContainer": {
                color:
                  theme === "dark"
                    ? "#5b6e93 !important"
                    : "#1e293b !important",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#cbd5e1" : "#334155",
                fontSize: "13px",
                backgroundColor: "transparent",
                borderBottom:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.05) !important"
                    : "1px solid rgba(241, 245, 249, 1) !important",
                "&:hover": {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255, 255, 255, 0.02) !important"
                      : "rgba(248, 250, 252, 1) !important",
                },
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none !important",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme === "dark" ? "#111827" : "#f8fafc",
                color: theme === "dark" ? "#cbd5e1" : "#334155",
                borderTop:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#cbd5e1" : "#334155",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff !important" : "#000 !important",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark"
                    ? "rgba(255, 255, 255, 0.3) !important"
                    : "rgba(0, 0, 0, 0.2) !important",
              },
              "& .Mui-checked": {
                color: "#37a39a !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#37a39a !important",
                fontSize: "12px",
                fontWeight: 500,
              },
            }}
          >
            <DataGrid
              checkboxSelection={!isDashboard}
              rows={rows}
              columns={columns}
              slots={isDashboard ? {} : { toolbar: GridToolbar }}
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
