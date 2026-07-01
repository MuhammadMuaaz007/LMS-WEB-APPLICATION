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
      className="block w-full max-w-[320px] mx-auto sm:mx-0 group"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 font-Poppins shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
        
        {/* THUMBNAIL IMAGE */}
        <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
          <Image
            src={item.thumbnail?.url || "/course-placeholder.png"}
            fill
            sizes="(max-w-sm) 100vw, 350px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            alt={item.name || "Course Thumbnail"}
            priority
          />
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-800 shadow-xs backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
            Course
          </div>
        </div>

        {/* CONTENT CARD BODY */}
        <div className="mt-3 flex flex-col gap-2.5">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 line-clamp-1 group-hover:text-[#37a39a] transition-colors duration-200">
              {item.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.description ||
                "Master this technology from scratch with hands-on real-world projects and step-by-step interactive sessions."}
            </p>
          </div>

          {/* RATINGS & ENROLLED */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-1.5 dark:bg-slate-900/50">
            <div className="origin-left scale-85">
              <Ratings rating={Number(item.ratings ?? 0)} />
            </div>
            <span
              className={`text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 ${
                isProfile ? "hidden lg:inline" : "inline"
              }`}
            >
              {item.purchased ?? 0} Enrolled
            </span>
          </div>

          {/* PRICE & LECTURES COUNT */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-900">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#37a39a]">
               $ {item.price === 0 ? "Free" : `${item.price.toLocaleString()}`}
              </span>
              {item.estimatedPrice && item.price !== 0 && (
                <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-medium">
                  ${`${item.estimatedPrice.toLocaleString()}`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50/50 px-2.5 py-1 text-slate-600 dark:border-slate-900 dark:bg-slate-900/30 dark:text-slate-400">
              <AiOutlineUnorderedList size={12} className="text-[#37a39a]" />
              <span className="text-[10px] font-semibold">
                {item.courseData?.length ?? 0} Lectures
              </span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default CourseCard;