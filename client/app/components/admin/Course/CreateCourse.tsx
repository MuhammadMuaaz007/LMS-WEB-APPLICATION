"use client";
import React, { useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"; // ✅ Fixed import path for Next.js 13+ App Router

const CreateCourse = () => {
  const [active, setActive] = useState(0);
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const router = useRouter();

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    category: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoLength: "",
      videoSection: "untitled Section",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);

  const stepNames = [
    "Course Information",
    "Course Data",
    "Course Content",
    "Course Preview",
  ];

  // ✅ 1. Reusable helper to format data cleanly on demand
  const getFormattedCourseData = () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));

    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoLength: courseContent.videoLength,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      }),
    );

    return {
      name: courseInfo.name,
      description: courseInfo.description,
      price: Number(courseInfo.price), // Ensure numbers are parsed correctly if needed
      category: courseInfo.category,
      estimatedPrice: Number(courseInfo.estimatedPrice),
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };
  };

  // Keep for compatibility with Step 2's prop injection contract
  const handleSubmit = async () => {
    // Simply serves as a placeholder pass-through for Step 2 navigation now
  };

  // ✅ 2. Synchronous Form Compiler Execution
  const handleCourseCreate = async () => {
    const dynamicFinalData = getFormattedCourseData();
    console.log("Submitting perfectly synced course data:", dynamicFinalData);

    try {
      await createCourse(dynamicFinalData).unwrap();

      toast.success("Course created successfully!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Mutation error payload:", error);
      const errorMessage =
        error?.data?.message || "Failed to create course. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-transparent">
      {/* 📱 MOBILE NAVIGATION BAR */}
      <div className="w-full block md:hidden pt-8 pb-4 px-4 sticky top-[80px] z-40 bg-transparent">
        <div className="w-full flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-full mb-3">
            <CourseOptions active={active} setActive={setActive} />
          </div>
          <p className="text-[11px] font-Poppins font-medium text-[#37a39a] uppercase tracking-wider">
            {stepNames[active]}
          </p>
        </div>
      </div>

      {/* WORKSPACE FORMS */}
      <div className="w-full md:w-[75%] lg:w-[80%] p-4 sm:p-6 md:p-10 box-border mt-4 md:mt-0">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            active={active}
            setActive={setActive}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={getFormattedCourseData()}
            isLoading={isLoading}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>

      {/* 💻 DESKTOP SIDEBAR */}
      <div className="hidden md:block md:w-[240px] lg:w-[280px] flex-shrink-0 relative">
        <div className="fixed top-[120px] right-4 lg:right-8 w-[200px] lg:w-[240px]">
          <CourseOptions active={active} setActive={setActive} />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
