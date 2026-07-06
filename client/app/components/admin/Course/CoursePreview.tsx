"use client";

import CoursePlayer from "../../../utils/CoursePlayer";
import Ratings from "../../../utils/Ratings";
import React, { FC } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import CourseData from "./CourseData";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit?: boolean;
  isLoading?: boolean;
};

const CoursePreview: FC<Props> = ({
  active,
  setActive,
  courseData,
  handleCourseCreate,
  isEdit,
  isLoading = false,
}) => {
  const discountPercentage = courseData?.estimatedPrice
    ? ((courseData.estimatedPrice - courseData.price) /
        courseData.estimatedPrice) *
      100
    : 0;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  return (
    <div className="w-full max-w-[850px] mx-auto mt-4 md:mt-10 p-4 font-Poppins text-slate-800 dark:text-gray-100 box-border">
      <div className="w-full flex flex-col gap-8">
        <div className="w-full space-y-6">
          <div className="bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 sm:p-6 shadow-sm">
            {/* Embedded Media Player Frame Wrapper */}
            <div className="w-full rounded-xl overflow-hidden shadow-inner bg-black aspect-video relative">
              <CoursePlayer
                videoUrl={courseData?.demoUrl}
                title={courseData?.title}
              />
            </div>

            {/* Pricing Section Modules */}
            <div className="flex flex-wrap items-baseline gap-3 pt-6 pb-2">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {courseData?.price === 0 ? "Free" : `${courseData?.price}$`}
              </h3>
              {courseData?.estimatedPrice && (
                <>
                  <span className="text-base text-slate-400 dark:text-gray-500 line-through">
                    {courseData?.estimatedPrice}$
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#37a39a]/10 dark:bg-[#37a39a]/20 text-[#37a39a]">
                    {discountPercentagePrice}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Main Checkout Interaction Button */}
            <button
              type="button"
              className="w-full h-[46px] bg-[#37a39a] text-white font-medium text-sm rounded-xl transition-all duration-200 opacity-90 cursor-not-allowed hover:bg-[#2d857e] shadow-md shadow-[#37a39a]/10"
            >
              Buy Now —{" "}
              {courseData?.price === 0
                ? "Access Free"
                : `${courseData?.price}$`}
            </button>

            {/* Discount Promo Field Entry Input */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <input
                type="text"
                placeholder="Discount code..."
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 h-[38px] text-xs text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] transition-all"
              />
              <button
                type="button"
                className="h-[38px] px-5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/10 font-medium text-xs rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* 📋 2. BOTTOM DETAILS AREA */}
        <div className="w-full space-y-8 min-w-0 px-1">
          {/* Header Title Metadata block */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {courseData?.name || "Untitled Course Template"}
            </h1>
            {/* <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Ratings rating={courseData?.rating || 0} />
                <span className="ml-1">{courseData?.rating || 0}.0</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-gray-700" />
              <span>{courseData?.purchased || 0} Students Enrolled</span>
            </div> */}
          </div>

          {/* Benefits Box Segment */}
          <div className="space-y-3">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-slate-900 dark:text-white">
              What you will learn from this course?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {courseData?.benefits?.map((item: any, index: number) => (
                <div className="flex items-start gap-2.5 py-1" key={index}>
                  <IoCheckmarkDoneOutline className="text-[#37a39a] text-lg mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-300 break-words pr-2">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites Section */}
          <div className="space-y-3">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-slate-900 dark:text-white">
              What are the prerequisites for starting this course?
            </h2>
            <div className="space-y-2">
              {courseData?.prerequisites?.map((item: any, index: number) => (
                <div className="flex items-start gap-2.5 py-1" key={index}>
                  <IoCheckmarkDoneOutline className="text-[#37a39a] text-lg mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-300 break-words">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Baseline Features Bullet Checklist */}
          <div className="space-y-3 pt-2">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-slate-900 dark:text-white">
              What's Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-slate-500 dark:text-gray-400">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37a39a] flex-shrink-0" />
                <span>Source code assets included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37a39a] flex-shrink-0" />
                <span>Full lifetime accessibility license</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37a39a] flex-shrink-0" />
                <span>Verified certification document on completion</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37a39a] flex-shrink-0" />
                <span>Premium developer support channel access</span>
              </div>
            </div>
          </div>

          {/* Dynamic Description Context Block */}
          <div className="space-y-3 pt-2">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-slate-900 dark:text-white">
              Course Details
            </h2>
            <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-gray-300 whitespace-pre-line tracking-wide break-words">
              {courseData?.description ||
                "No full course description summary provided yet."}
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 RESPONSIVE BOTTOM NAVIGATION ACTION BAR FOOTER */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-12 pt-6 border-t border-gray-200/60 dark:border-white/10">
        <button
          type="button"
          disabled={isLoading}
          className="w-full sm:w-[150px] order-2 sm:order-1 flex items-center justify-center h-[42px] border border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 font-medium text-sm rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setActive(active - 1)}
        >
          Previous Step
        </button>

        {/* ✅ Updated Action Button with Inline Loading Spinner */}
        <button
          type="button"
          disabled={isLoading}
          className="w-full sm:w-[150px] order-1 sm:order-2 flex items-center justify-center h-[42px] bg-[#37a39a] text-white font-medium text-sm rounded-xl transition-all duration-200 select-none shadow-md shadow-[#37a39a]/10 hover:bg-[#2d857e] disabled:opacity-80 disabled:cursor-not-allowed gap-2"
          onClick={handleCourseCreate}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>{isEdit ? "Update Course" : "Create Course"}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CoursePreview;
