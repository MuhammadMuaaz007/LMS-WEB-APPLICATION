"use client";
import React from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import avatarDefault from "../../../public/assets/avatar.png";

type UserType = {
  role: string;
  avatar?: {
    url: string;
  };
};

type Props = {
  user: UserType;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: () => void;
};

const SideBarProfile = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}: Props) => {
  const tabClass = (id: number) => `
    w-full flex flex-row items-center justify-center min-[800px]:justify-start 
    h-[44px] min-[800px]:px-4 my-1 rounded-xl cursor-pointer transition-all duration-200 select-none group
    ${
      active === id
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
    }
  `;

  const iconClass = (id: number) => `
    text-[22px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105
    ${active === id ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"}
  `;

  return (
    <div className="w-full p-2 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-1">
        {/* Account Tab */}
        <div className={tabClass(1)} onClick={() => setActive(1)}>
          {/* This wrapper guarantees a flawless, un-squeezable circle */}
          <div
            className={`relative w-7 h-7 rounded-full overflow-hidden aspect-square flex-shrink-0 border-2 transition-colors
            ${active === 1 ? "border-white" : "border-transparent"}`}
          >
            <Image
              src={user?.avatar?.url || avatar || avatarDefault}
              alt="Profile Avatar"
              fill
              sizes="28px"
              className="object-cover"
              priority
            />
          </div>
          <h5 className="pl-3 min-[800px]:block hidden font-medium text-[15px] whitespace-nowrap">
            My Account
          </h5>
        </div>

        {/* Change Password Tab */}
        <div className={tabClass(2)} onClick={() => setActive(2)}>
          <RiLockPasswordLine className={iconClass(2)} />
          <h5 className="pl-3 min-[800px]:block hidden font-medium text-[15px] whitespace-nowrap">
            Change Password
          </h5>
        </div>

        {/* Enrolled Courses Tab */}
        <div className={tabClass(3)} onClick={() => setActive(3)}>
          <SiCoursera className={iconClass(3)} />
          <h5 className="pl-3 min-[800px]:block hidden font-medium text-[15px] whitespace-nowrap">
            Enrolled Courses
          </h5>
        </div>

        {/* Admin Dashboard Tab */}
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className={tabClass(5)}
            onClick={() => setActive(5)}
          >
            <MdOutlineAdminPanelSettings className={iconClass(5)} />
            <h5 className="pl-3 min-[800px]:block hidden font-medium text-[15px] whitespace-nowrap">
              Admin Dashboard
            </h5>
          </Link>
        )}
      </div>

      {/* Logout Action */}
      <div className="mt-4 pt-2 border-t dark:border-slate-800 border-slate-200/60">
        <div
          className="w-full flex flex-row items-center justify-center min-[800px]:justify-start min-[800px]:px-4 h-[44px] rounded-xl cursor-pointer text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
          onClick={logOutHandler}
        >
          <BiLogOutCircle className="text-[22px] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          <h5 className="pl-3 min-[800px]:block hidden font-medium text-[15px] whitespace-nowrap">
            Logout
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SideBarProfile;
