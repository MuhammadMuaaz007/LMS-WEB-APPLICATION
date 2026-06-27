"use client";

import React, { FC } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js"; 
import Link from "next/link";

type Props = {};

const AllCourses: FC<Props> = () => {
  const { isLoading, data } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  const courses = data?.courses || [];

  return (
    <div className="w-full p-4 sm:p-6 md:p-10 font-Poppins box-border mt-14 md:mt-0 text-slate-800 dark:text-gray-100">
      
      {/* HEADER SECTION METADATA */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Live Courses Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
          Manage, analyze, and track active publications on your workspace curriculum stack.
        </p>
      </div>

      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : courses.length > 0 ? (
        /* 🗂️ RESPONSIVE CARD GRID LAYOUT */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((item: any) => (
            <div
              key={item._id}
              className="w-full flex flex-col bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
            >
              {/* 🖼️ IMAGE / TEXT PLACEHOLDER SECTION */}
              <div className="w-full aspect-video relative overflow-hidden bg-slate-100 dark:bg-[#111322] border-b border-gray-200/60 dark:border-white/10 flex items-center justify-center select-none">
                {item.thumbnail && item.thumbnail.url ? (
                  /* Render actual Image thumbnail if structure exists */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  /* 🧩 Fallback Placeholder: Shows course name cleanly when image is missing */
                  <div className="w-full h-full p-4 flex items-center justify-center text-center bg-gradient-to-br from-[#37a39a]/5 to-[#37a39a]/10 dark:from-[#37a39a]/10 dark:to-transparent">
                    <span className="text-xs sm:text-sm font-semibold text-[#37a39a] font-Poppins line-clamp-2 px-2 tracking-wide leading-snug">
                      {item.name}
                    </span>
                  </div>
                )}
                
                {/* Micro Rating Tag Overlaid directly onto frame */}
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-[#0b0c14]/90 backdrop-blur-sm border border-gray-200/40 dark:border-white/5 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-[#37a39a] shadow-sm flex items-center gap-1">
                  <span className="text-amber-500 text-[10px]">★</span>{" "}
                  {item.rating ? item.rating.toFixed(1) : "0.0"}
                </div>
              </div>

              {/* 📝 CORE CARD CONTENT FIELDS */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  
                  {/* COURSE ID TAG (Hand pointer, hovers complete string, clicks to select all) */}
                  <div className="mb-2">
                    <span 
                      title={item._id || "No ID Available"}
                      className="text-[10px] font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md cursor-pointer select-all"
                    >
                      ID: {item._id ? `${item._id.slice(0, 8)}...` : "N/A"}
                    </span>
                  </div>

                  {/* COURSE TITLE (Line clamped, hand pointer, hovers complete name) */}
                  <h3 
                    title={item.name}
                    className="text-[15px] font-semibold text-slate-800 dark:text-gray-100 line-clamp-1 tracking-wide leading-snug group-hover:text-[#37a39a] transition-colors duration-200 mb-1.5 cursor-pointer"
                  >
                    {item.name}
                  </h3>
                  
                  {/* Dynamic Summary Description Block (Safely contained) */}
                  <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed tracking-wide min-h-[32px]">
                    {item.description || "No full summary context provided for this curriculum catalog structure."}
                  </p>
                </div>

                {/* EXTRA TIMING STRIP: Shows creation age subtly above the main metrics */}
                <div className="mt-4 text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                  Added {format(item.createdAt)}
                </div>

                {/* 💳 BOTTOM FOOTER METRICS & ACTIONS */}
                <div className="pt-3 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between mt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      Purchased
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {item.purchased || 0} Students
                    </span>
                  </div>

                  {/* INTERACTIVE ACTIONS */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/edit-course/${item._id}`}
                      className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 dark:text-gray-500 hover:bg-[#37a39a]/10 hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-all duration-200"
                      title="Edit Course"
                    >
                      <FiEdit2 size={15} />
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
                      title="Delete Course"
                    >
                      <AiOutlineDelete size={17} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative top hover line accent */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-transparent group-hover:bg-[#37a39a] transition-colors duration-200" />
            </div>
          ))}
        </div>
      ) : (
        /* ZERO STATE FALLBACK */
        <div className="w-full py-16 bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl text-center shadow-sm">
          <p className="text-sm text-slate-400 dark:text-gray-500 font-medium">
            No active courses discovered in your repository.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllCourses;