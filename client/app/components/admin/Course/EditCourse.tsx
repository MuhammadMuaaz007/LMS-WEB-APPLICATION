"use client";
import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  const { data, refetch } = useGetAllCoursesQuery(
    undefined, // ✅ Using undefined instead of empty object to ensure correct cache mapping
    { refetchOnMountOrArgChange: true },
  );
  
  const EditCourseData = data?.courses?.find(
    (course: any) => course._id === id,
  );

  const [active, setActive] = useState(0);
  const [editCourse, { isLoading: isEditCourseLoading }] = useEditCourseMutation();
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

    const payload: any = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: Number(courseInfo.price),
      category: courseInfo.category,
      estimatedPrice: Number(courseInfo.estimatedPrice),
      tags: courseInfo.tags,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };

    // ✅ PERFORMANCE OPTIMIZATION: Only attach thumbnail text if a brand new file was chosen
    // (Prevents resending unchanged cloud storage objects/URLs back across HTTP pipes)
    if (typeof courseInfo.thumbnail === "string" && courseInfo.thumbnail.startsWith("data:image")) {
      payload.thumbnail = courseInfo.thumbnail;
    }

    return payload;
  };

  const handleSubmit = async () => {};

  const handleCourseCreate = async () => {
    const formattedData = getFormattedCourseData();

    try {
      // 1. Fire update request to server
      await editCourse({ id: EditCourseData._id, data: formattedData }).unwrap();

      toast.success("Course updated successfully!");
      
      // 2. Redirect to dashboard immediately without blocking the UI thread
      router.push("/admin/courses");

      // 3. Trigger refetch concurrently in the background so it loads while navigating
      if (refetch) {
        refetch();
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to update course. Please try again.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (EditCourseData) {
      setCourseInfo({
        name: EditCourseData.name,
        description: EditCourseData.description,
        price: EditCourseData.price?.toString() || "",
        estimatedPrice: EditCourseData.estimatedPrice?.toString() || "",
        category: EditCourseData.category || "",
        tags: EditCourseData.tags || "",
        level: EditCourseData.level || "",
        demoUrl: EditCourseData.demoUrl || "",
        thumbnail: EditCourseData.thumbnail || "",
      });
      setBenefits(EditCourseData.benefits || [{ title: "" }]);
      setPrerequisites(EditCourseData.prerequisites || [{ title: "" }]);
      setCourseContentData(EditCourseData.courseData || []);
    }
  }, [EditCourseData]);

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
            isLoading={isEditCourseLoading}
            handleCourseCreate={handleCourseCreate}
            isEdit={true}
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

export default EditCourse;