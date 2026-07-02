"use client";

import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";

import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import CourseContentList from "./CourseContentList";

type Props = {
  data: any;
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const CourseDetails = ({ data, setRoute, setOpen: openAuthModal }: Props) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [reversedReviews, setReversedReviews] = useState<any[]>([]);

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  useEffect(() => {
    if (data?.reviews) {
      setReversedReviews([...data.reviews].reverse());
    } else {
      setReversedReviews([]);
    }
  }, [data?.reviews]);

  const discountPercentage = data?.estimatedPrice
    ? ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
    : 0;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);

  const handleOrder = () => {
    if (!user) {
      setRoute("Login");
      openAuthModal(true);
    } else {
      // Direct enrollment logic
    }
  };

  return (
    <div className="w-full bg-transparent font-Poppins text-slate-800 dark:text-slate-200">
      <div className="w-[92%] max-w-7xl mx-auto py-10">
        <div className="w-full flex flex-col-reverse md:flex-row items-start gap-10">
          {/* LEFT COLUMN: COURSE CONTENT & FEEDBACK */}
          <div className="w-full md:w-[65%] space-y-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                {data?.name}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Ratings rating={data?.rating} />
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    ({data.rating || 0} ★)
                  </span>
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#37a39a] bg-[#37a39a]/10 px-3 py-1 rounded-full">
                  {data?.purchased || 0} Students Enrolled
                </span>
              </div>
            </div>

            {/* BENEFITS */}
            <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-white/5 dark:bg-[#0b0c14]/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                What you will learn from this course
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data?.benefits?.map((item: any, index: number) => (
                  <div className="flex items-start gap-2.5 py-1" key={index}>
                    <IoCheckmarkDoneOutline
                      size={18}
                      className="text-[#37a39a] shrink-0 mt-0.5"
                    />
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PREREQUISITES */}
            <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-white/5 dark:bg-[#0b0c14]/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Prerequisites for starting this course
              </h2>
              <div className="space-y-3">
                {data?.prerequisites?.map((item: any, index: number) => (
                  <div className="flex items-start gap-2.5" key={index}>
                    <IoCheckmarkDoneOutline
                      size={18}
                      className="text-[#37a39a] shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SYLLABUS OVERVIEW */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Course Syllabus Overview
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/5">
                <CourseContentList isDemo={true} data={data?.courseData} />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Course Details Description
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line bg-slate-50/50 dark:bg-white/4 p-5 rounded-2xl border border-slate-100 dark:border-transparent">
                {data?.description}
              </p>
            </div>

            {/* REVIEWS & REPLIES */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Student Feedback
                </h2>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  ({data.rating || 0} ★)
                </span>
              </div>

              <div className="space-y-4">
                {reversedReviews.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-slate-200/50 bg-white dark:border-white/5 dark:bg-[#0b0c14]/40 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            item.user?.avatar?.url ||
                            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={44}
                          height={44}
                          alt="User avatar"
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#37a39a]/10"
                        />
                        <div>
                          <h5 className="text-sm font-semibold text-slate-900 dark:text-white ">
                            {item.user?.name}
                          </h5>
                          <div className="flex items-center mt-1">
                            <div className="scale-75 origin-left">
                              <Ratings rating={item.rating} />
                            </div>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              ({item.rating || 0} / 5)
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {item.createdAt ? format(item.createdAt) : ""}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 pl-0 sm:pl-14 leading-relaxed">
                      {item.comment}
                    </p>

                    {item.commentReplies?.map(
                      (reply: any, replyIndex: number) => (
                        <div
                          className="ml-4 sm:ml-14 mt-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 flex gap-3 border border-slate-100 dark:border-transparent"
                          key={replyIndex}
                        >
                          <Image
                            src={
                              reply.user?.avatar?.url ||
                              "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={36}
                            height={36}
                            alt="Staff avatar"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/10"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                {reply.user?.name}
                              </h5>
                              <VscVerifiedFilled className="text-[#37a39a] text-sm" />
                              <span className="text-[9px] bg-blue-500/15 text-[#37a39a] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                                Staff
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {reply.comment}
                            </p>
                            <span className="block text-[10px] text-slate-400 pt-1">
                              {reply.createdAt ? format(reply.createdAt) : ""}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FIXED STICKY VIDEO PLAYER & PURCHASE PANEL CARD */}
          <div className="w-full md:w-[35%] md:sticky md:top-28 md:h-fit">
            <div className="w-full overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0c14]/90 dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.55)]">
              <div className="overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                <CoursePlayer videoUrl={data?.demoUrl} />
              </div>

              <div className="p-3 space-y-5">
                <div className="flex items-baseline justify-between pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-[#37a39a]">
                      {data?.price === 0 ? "Free" : `$${data?.price}`}
                    </span>
                    {data?.estimatedPrice && data?.price !== 0 && (
                      <span className="text-sm line-through opacity-50 text-slate-400 dark:text-slate-500 font-medium">
                        {`$${data.estimatedPrice}`}
                      </span>
                    )}
                  </div>
                  {data?.estimatedPrice && data?.price !== 0 && (
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">
                      {discountPercentagePrice}% Off
                    </span>
                  )}
                </div>

                <div>
                  {isPurchased ? (
                    <Link
                      className="flex items-center justify-center w-full py-3.5 px-4 font-semibold text-sm rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 shadow-md shadow-blue-500/20 text-center transition-all duration-200"
                      href={`/course-access/${data?._id}`}
                    >
                      Enter to Course
                    </Link>
                  ) : (
                    <button
                      className="w-full py-3.5 px-4 font-semibold text-sm rounded-xl text-white bg-gradient-to-r from-[#37a39a] to-blue-600 hover:opacity-95 shadow-md shadow-[#37a39a]/20 transition-all duration-200 cursor-pointer"
                      onClick={handleOrder}
                    >
                      Enroll Now •{" "}
                      {data?.price === 0 ? "Free Access" : `$${data?.price}`}
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-2.5">
                  {[
                    "Source code material files included",
                    "Full uninterrupted lifetime access",
                    "Verifiable certificate of completion",
                    "Premium direct mentor support access",
                  ].map((perk, i) => (
                    <div
                      className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
                      key={i}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#37a39a]/80" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;