"use client";
import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";

import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  ExitToAppIcon,
} from "./Icon";
import avatarDefault from "../../../../public/assets/avatar.png";

interface SidebarItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  isCollapsed: boolean;
  currentPath: string | null;
}

const SidebarItem: FC<SidebarItemProps> = ({
  title,
  to,
  icon,
  isCollapsed,
  currentPath,
}) => {
  const isActive = currentPath === to;

  return (
    <Link
      href={to}
      className={`w-full flex items-center h-[44px] my-0.5 rounded-xl transition-all duration-200 select-none group relative cursor-pointer z-10
        ${isCollapsed ? "justify-center px-0" : "justify-start px-4"}
        ${
          isActive
            ? "bg-[#37a39a]/10 dark:bg-[#37a39a]/15 text-[#37a39a] font-semibold"
            : "text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
        }
      `}
    >
      {isActive && !isCollapsed && (
        <div className="absolute left-0 w-1 h-5 rounded-r-full bg-[#37a39a]" />
      )}

      <div
        className={`text-[20px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105 
          ${isActive ? "text-[#37a39a]" : "text-slate-400 dark:text-gray-500 group-hover:text-slate-700 dark:group-hover:text-gray-300"}`}
      >
        {icon}
      </div>

      {!isCollapsed && (
        <span className="pl-3 text-[14px] font-medium tracking-wide whitespace-nowrap font-Poppins">
          {title}
        </span>
      )}

      {isCollapsed && (
        <div className="absolute left-20 scale-0 transition-all rounded-md bg-slate-900 dark:bg-gray-800 px-2.5 py-1.5 text-xs text-white group-hover:scale-100 shadow-xl border border-slate-800 dark:border-white/10 z-[99999] whitespace-nowrap hidden md:block">
          {title}
        </div>
      )}
    </Link>
  );
};

const AdminSidebar = () => {
  // ✅ Initialize collapsed based on actual screen width
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const { user } = useSelector((state: any) => state.auth);
  const pathname = usePathname();

  // ✅ Re-sync on resize (e.g. rotating device, resizing browser)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoutHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Static Logout Clicked");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-[99] flex flex-col justify-between transition-all duration-300 border-r
        bg-white dark:bg-[#0b0c14] border-gray-200/60 dark:border-white/10 box-border
        ${isCollapsed ? "w-[75px]" : "w-[260px]"}`}
        // ✅ Removed max-md:w-[70px] and max-md:items-center — isCollapsed drives width now
    >
      {/* TOP SECTION */}
      <div className="w-full flex flex-col overflow-y-auto overflow-x-hidden p-3 flex-grow [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* LOGO & TOGGLE */}
        <div
          className={`flex items-center min-h-[80px] mb-2 w-full ${isCollapsed ? "justify-center" : "justify-between pl-2"}`}
        >
          {!isCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2 text-[22px] font-Poppins font-semibold text-black dark:text-white tracking-tight transition-opacity hover:opacity-80"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#37a39a]" />
              SkillStack
            </Link>
          )}
          {/* ✅ Removed max-md:hidden — toggle must be accessible on mobile */}
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-slate-100 dark:hover:bg-white/5 transition-colors p-2 text-black dark:text-white"
          >
            {isCollapsed ? (
              <ArrowForwardIosIcon className="!text-sm text-slate-600 dark:text-gray-400" />
            ) : (
              <ArrowBackIosIcon className="!text-sm text-slate-600 dark:text-gray-400" />
            )}
          </IconButton>
        </div>

        {/* USER PROFILE CARD */}
        <div
          className={`flex flex-col items-center justify-center border-b border-gray-200/60 dark:border-white/10 pb-5 mb-4
            ${isCollapsed ? "mx-0" : "mx-2"}`}
            // ✅ Removed max-md:hidden — isCollapsed already hides the text, avatar still shows
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#37a39a] to-[#0d9488] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div
              className={`relative rounded-full overflow-hidden border border-gray-200 dark:border-white/10 transition-all duration-300
              ${isCollapsed ? "w-9 h-9" : "w-[64px] h-[64px]"}`}
            >
              <Image
                alt="profile-user"
                fill
                sizes="(max-width: 768px) 36px, 64px"
                src={user?.avatar ? user.avatar.url : avatarDefault}
                className="object-cover"
              />
            </div>
          </div>

          {!isCollapsed && user && (
            <div className="text-center mt-2.5 transition-all duration-300">
              <h4 className="text-[14px] font-semibold text-slate-800 dark:text-gray-200 font-Poppins">
                {user.name}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                {user.role}
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-col gap-0.5">
          <SidebarItem
            title="Dashboard"
            to="/admin"
            icon={<HomeOutlinedIcon />}
            isCollapsed={isCollapsed}
            currentPath={pathname}
          />

          <p
            className={`text-[10px] font-bold text-[#37a39a]/90 uppercase tracking-widest mt-4 mb-1.5 pl-3 
            ${isCollapsed ? "hidden" : "text-left"}`}
            // ✅ Simplified: just hide when collapsed, no max-md needed
          >
            Data
          </p>
          <SidebarItem title="Users" to="/admin/users" icon={<GroupsIcon />} isCollapsed={isCollapsed} currentPath={pathname} />
          <SidebarItem title="Invoices" to="/admin/invoices" icon={<ReceiptOutlinedIcon />} isCollapsed={isCollapsed} currentPath={pathname} />

          <p className={`text-[10px] font-bold text-[#37a39a]/90 uppercase tracking-widest mt-4 mb-1.5 pl-3 ${isCollapsed ? "hidden" : "text-left"}`}>
            Content
          </p>
          <SidebarItem title="Create Course" to="/admin/create-course" icon={<VideoCallIcon />} isCollapsed={isCollapsed} currentPath={pathname} />
          <SidebarItem title="Live Courses" to="/admin/courses" icon={<OndemandVideoIcon />} isCollapsed={isCollapsed} currentPath={pathname} />

          <p className={`text-[10px] font-bold text-[#37a39a]/90 uppercase tracking-widest mt-4 mb-1.5 pl-3 ${isCollapsed ? "hidden" : "text-left"}`}>
            Customization
          </p>
          <SidebarItem title="Hero" to="/admin/hero" icon={<WebIcon />} isCollapsed={isCollapsed} currentPath={pathname} />
          <SidebarItem title="FAQ" to="/admin/faq" icon={<QuizIcon />} isCollapsed={isCollapsed} currentPath={pathname} />
          <SidebarItem title="Categories" to="/admin/categories" icon={<WysiwygIcon />} isCollapsed={isCollapsed} currentPath={pathname} />

          <p className={`text-[10px] font-bold text-[#37a39a]/90 uppercase tracking-widest mt-4 mb-1.5 pl-3 ${isCollapsed ? "hidden" : "text-left"}`}>
            Controllers
          </p>
          <SidebarItem title="Manage Team" to="/admin/team" icon={<PeopleOutlinedIcon />} isCollapsed={isCollapsed} currentPath={pathname} />

          <p className={`text-[10px] font-bold text-[#37a39a]/90 uppercase tracking-widest mt-4 mb-1.5 pl-3 ${isCollapsed ? "hidden" : "text-left"}`}>
            Analytics
          </p>
          <SidebarItem title="Courses Analytics" to="/admin/courses-analytics" icon={<BarChartOutlinedIcon />} isCollapsed={isCollapsed} currentPath={pathname} />
          <SidebarItem title="Orders Analytics" to="/admin/orders-analytics" icon={<MapOutlinedIcon />} isCollapsed={isCollapsed} currentPath={pathname} />
          <SidebarItem title="Users Analytics" to="/admin/users-analytics" icon={<ManageHistoryIcon />} isCollapsed={isCollapsed} currentPath={pathname} />
        </div>
      </div>

      {/* FOOTER (LOGOUT) */}
      <div className="p-3 border-t dark:border-white/10 border-gray-200/60 w-full">
        <Link
          href="/"
          onClick={logoutHandler}
          className={`w-full flex items-center h-[44px] rounded-xl transition-all duration-200 select-none group text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer
            ${isCollapsed ? "justify-center px-0" : "justify-start px-4"}`}
        >
          <div className="text-[20px] flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200">
            <ExitToAppIcon />
          </div>
          {!isCollapsed && (
            <span className="pl-3 text-[14px] font-medium tracking-wide whitespace-nowrap font-Poppins">
              Logout
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;