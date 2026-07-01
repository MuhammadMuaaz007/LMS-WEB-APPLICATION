import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React from "react";
import CourseCard from "../Course/CourseCard";

type Course = {
  _id: string;
  thumbnail?: { url?: string };
  name?: string;
  description?: string;
  ratings?: number;
  purchased?: number;
  price: number;
  estimatedPrice?: number;
  courseData?: unknown[];
};

const Courses = () => {
  const { data } = useGetUserAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const courses: Course[] = data?.courses ?? [];

  return (
    <div className="relative mt-8 md:mt-12 pb-8">
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#37a39a]">
            Featured Courses
          </span>
          <h1 className="mt-4 font-Poppins text-[28px] leading-[1.1] sm:text-[36px] lg:text-[48px] font-bold tracking-tight text-slate-900 dark:text-white">
            Expand your career with{" "}courses
            <span className="text-gradient text-[#37a39a]">
               <br></br>that feel premium
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6.25 lg:grid-cols-3 lg:gap-1.25 1500px:grid-cols-4 1500px:gap-8.75 mb-12 border-0">
          {courses.map((item: Course, index: number) => (
            <CourseCard item={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
