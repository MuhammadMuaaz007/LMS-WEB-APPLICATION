"use client";

import React, { FC } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2, FiMail, FiUserPlus } from "react-icons/fi"; 
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";

type Props = {
  isTeam?: boolean; 
};

const AllUsers: FC<Props> = ({ isTeam = false }) => {
  const { data, isLoading } = useGetAllUsersQuery({});

  const allUsers = data?.users || [];

  // Filter out only admins if this component is rendered in "Team" mode
  const filteredUsers = isTeam 
    ? allUsers.filter((user: any) => user.role === "admin")
    : allUsers;

  return (
    <div className="w-full p-4 sm:p-6 md:p-10 font-Poppins box-border mt-14 md:mt-0 text-slate-800 dark:text-gray-100">
      
      {/* 🚀 HEADER SECTION (Safe flow alignment) */}
      <div className="w-full flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isTeam ? "Manage Team Members" : "Platform Users Overview"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 max-w-[750px]">
            {isTeam 
              ? "Administrate workspace permissions, update security clearings, and configure operational access tokens."
              : "Manage profiles, view roles, track student enrollment metrics, and monitor portal registration details."
            }
          </p>
        </div>

        {/* ✅ FIX: Button relocated here (below text, inside content grid flow) */}
        {isTeam && (
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-5 h-[40px] bg-[#37a39a] hover:bg-[#2d857e] text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md shadow-[#37a39a]/10 select-none whitespace-nowrap w-fit mt-1"
          >
            <FiUserPlus size={16} />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : filteredUsers.length > 0 ? (
        /* 🗂️ RESPONSIVE CARD GRID LAYOUT */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((item: any) => {
            const initialLetter = item.name ? item.name.charAt(0).toUpperCase() : "?";

            return (
              <div
                key={item._id}
                className="w-full flex flex-col bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
              >
                {/* 🖼️ AVATAR INITIAL PLACEHOLDER SECTION */}
                <div className="w-full aspect-video relative overflow-hidden bg-slate-100 dark:bg-[#111322] border-b border-gray-200/60 dark:border-white/10 flex items-center justify-center select-none">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#37a39a]/10 to-[#37a39a]/30 text-[#37a39a] text-2xl font-bold shadow-inner">
                    {initialLetter}
                  </div>

                  {/* Floating Account Role Tag */}
                  <div
                    className={`absolute top-2 right-2 border px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
                      item.role === "admin"
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        : "bg-[#37a39a]/10 border-[#37a39a]/20 text-[#37a39a]"
                    }`}
                  >
                    {item.role || "user"}
                  </div>
                </div>

                {/* 📝 CORE CARD CONTENT FIELDS */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* USER ID BADGE */}
                    <div>
                      <span
                        title={item._id || "No ID Available"}
                        className="text-[10px] font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md cursor-pointer select-all"
                      >
                        ID: {item._id ? `${item._id.slice(0, 8)}...` : "N/A"}
                      </span>
                    </div>

                    {/* USER NAME */}
                    <h3
                      title={item.name}
                      className="text-[16px] font-semibold text-slate-800 dark:text-gray-100 line-clamp-1 tracking-wide leading-none group-hover:text-[#37a39a] transition-colors duration-200 cursor-pointer"
                    >
                      {item.name || "Unnamed Account"}
                    </h3>

                    {/* USER EMAIL */}
                    <p
                      title={item.email}
                      className="text-xs text-slate-500 dark:text-gray-400 truncate tracking-wide cursor-pointer"
                    >
                      {item.email}
                    </p>

                    {/* REGISTRATION TIMESTAMP */}
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide pt-1">
                      Joined {format(item.createdAt || item.joinedAt)}
                    </div>
                  </div>

                  {/* 💳 BOTTOM FOOTER METRICS & ACTIONS */}
                  <div className="pt-3 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between mt-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        Purchased
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {item.courses?.length || item.purchasedCourses || 0} Courses
                      </span>
                    </div>

                    {/* ACTION CONTROLS */}
                    <div className="flex items-center gap-1">
                      {/* GMAIL HANDLER */}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}&su=Message+from+Platform+Admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 dark:text-gray-500 hover:bg-[#37a39a]/10 hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-all duration-200"
                        title={`Email ${item.email}`}
                      >
                        <FiMail size={16} />
                      </a>

                      {/* DELETE TRIGGER */}
                      <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
                        title="Delete User Account"
                      >
                        <AiOutlineDelete size={17} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decorative top hover line accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-transparent group-hover:bg-[#37a39a] transition-colors duration-200" />
              </div>
            );
          })}
        </div>
      ) : (
        /* ZERO STATE FALLBACK */
        <div className="w-full py-16 bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl text-center shadow-sm">
          <p className="text-sm text-slate-400 dark:text-gray-500 font-medium">
            {isTeam 
              ? "No administrator team accounts discovered in this sector."
              : "No registered users discovered in your database repository."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AllUsers;