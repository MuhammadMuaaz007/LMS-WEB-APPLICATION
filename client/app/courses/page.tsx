"use client";
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/LayoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUserAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    } else {
      setCourses(
        data?.courses.filter((item: any) => item.category === category)
      );
    }
    if (search) {
      setCourses(
        data?.courses.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.layout.categories;

  return (
    <div className="bg-transparent min-h-screen text-black dark:text-white transition-colors duration-300">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          
          <div className="w-[92%] max-w-7xl mx-auto min-h-[85vh] mt-8">
            <Heading
              title={"All courses - SkillStack"}
              description={"SkillStack is a modern programming community and academy."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />

            {/* CATEGORIES CHIPS FILTERING ROW */}
            <div className="w-full flex items-center flex-wrap gap-2.5 py-4 border-b border-gray-200/60 dark:border-white/5">
              <button
                className={`h-[38px] px-5 rounded-full font-Poppins text-[13.5px] font-medium tracking-wide transition-all duration-200 cursor-pointer select-none
                  ${
                    category === "All"
                      ? "bg-gradient-to-r from-[#37a39a] to-[#2bbca2] text-white shadow-md shadow-[#37a39a]/15"
                      : "bg-gray-50 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/5 hover:border-[#37a39a]/50 dark:hover:border-[#37a39a]/50 hover:text-black dark:hover:text-white"
                  }`}
                onClick={() => setCategory("All")}
              >
                All Courses
              </button>

              {categories &&
                categories.map((item: any, index: number) => (
                  <button
                    key={index}
                    className={`h-[38px] px-5 rounded-full font-Poppins text-[13.5px] font-medium tracking-wide transition-all duration-200 cursor-pointer select-none
                      ${
                        category === item.title
                          ? "bg-gradient-to-r from-[#37a39a] to-[#2bbca2] text-white shadow-md shadow-[#37a39a]/15"
                          : "bg-gray-50 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/5 hover:border-[#37a39a]/50 dark:hover:border-[#37a39a]/50 hover:text-black dark:hover:text-white"
                      }`}
                    onClick={() => setCategory(item.title)}
                  >
                    {item.title}
                  </button>
                ))}
            </div>

            {/* EMPTY STATE */}
            {courses && courses.length === 0 && (
              <div className="w-full min-h-[55vh] flex flex-col items-center justify-center text-center px-4">
                <p className="text-[15px] font-medium text-slate-500 dark:text-gray-400 font-Poppins max-w-md leading-relaxed">
                  {search
                    ? `We couldn't find any results matches for "${search}".`
                    : "No courses are currently available in this category. Please check back later or browse other categories!"}
                </p>
              </div>
            )}

            {/* PREMIUM COURSES RESPONSIVE MATRIX GRID */}
            {courses && courses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 my-10">
                {courses.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[#37a39a]/5 rounded-2xl"
                  >
                    <CourseCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;