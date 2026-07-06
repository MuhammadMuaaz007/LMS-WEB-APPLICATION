"use client";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineUnorderedList } from "react-icons/ai";
import Ratings from "@/app/utils/Ratings";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `/course-access/${item._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-xs duration-300 transition hover:-translate-y-0.5 hover:shadow-md h-full max-w-[315px] w-full mx-auto sm:mx-0 font-Poppins dark:border-slate-800 dark:bg-slate-950"
    >
      {/* THUMBNAIL IMAGE CONTAINER */}
      <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
        <Image
          src={item.thumbnail?.url || "/course-placeholder.png"}
          alt={item.name || "Course Thumbnail"}
          fill
          sizes="(max-w-sm) 100vw, 315px"
          // ✅ Restored back to object-cover to stretch and fill the frame perfectly
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
          priority
        />
        <div className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-800 shadow-xs backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
          Course
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="flex flex-col flex-1 p-[18px]">
        
        {/* TEXT DETAILS */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1 group-hover:text-[#37a39a] transition-colors duration-200 line-clamp-1 leading-snug">
            {item.name}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2 mb-2.5">
            {item.description ||
              "Master this technology from scratch with hands-on real-world projects and step-by-step sessions."}
          </p>
        </div>

        {/* CLEAN RATINGS & ENROLLED STATS */}
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-3.5">
          <div className="origin-left scale-75">
            <Ratings rating={Number(item.ratings ?? item.rating ?? 0)} />
          </div>
          <span className="text-xs text-slate-200 dark:text-slate-800">|</span>
          <span
            className={`text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400 ${
              isProfile ? "hidden lg:inline" : "inline"
            }`}
          >
            {item.purchased ?? 0} Enrolled
          </span>
        </div>

        {/* FOOTER ACTIONS AND PRICING */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-[#37a39a]">
              ${item.price === 0 ? "Free" : `${item.price.toLocaleString()}`}
            </span>
            {item.estimatedPrice && item.price !== 0 && (
              <span className="text-[10px] line-through text-slate-400 dark:text-slate-500 font-medium">
                ${`${item.estimatedPrice.toLocaleString()}`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Lectures Count */}
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <AiOutlineUnorderedList size={11} className="text-[#37a39a]" />
              <span className="text-[10px] font-medium whitespace-nowrap">
                {item.courseData?.length ?? 0} Lects
              </span>
            </div>

            {/* View Arrow SVG */}
            <div className="flex items-center text-[#37a39a]/80 group-hover:text-[#37a39a] transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3 h-3 transition-transform duration-300 transform group-hover:translate-x-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default CourseCard;