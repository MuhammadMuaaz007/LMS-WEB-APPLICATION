"use client";
import React, { useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";

const CreateCourse = () => {
  const [active, setActive] = useState(0);
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
  const [courseData, setCourseData] = useState({});

  const stepNames = [
    "Course Information",
    "Course Data",
    "Course Content",
    "Course Preview",
  ];
  const handleSubmit = () => {};

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-transparent">
      {/* 📱 MOBILE NAVIGATION BAR: Replace your old mobile div with this one */}
      <div className="w-full block md:hidden pt-8 pb-4 px-4 sticky top-[80px] z-40 bg-transparent text-center">
        <div className="inline-block mx-auto mb-2">
          <CourseOptions active={active} setActive={setActive} />
        </div>
        <p className="text-[11px] font-Poppins font-medium text-[#37a39a] uppercase tracking-wider mt-2">
          {stepNames[active]}
        </p>
      </div>

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
      </div>

      <div className="hidden md:block md:w-[240px] lg:w-[280px] flex-shrink-0 relative">
        <div className="fixed top-[120px] right-4 lg:right-8 w-[200px] lg:w-[240px]">
          <CourseOptions active={active} setActive={setActive} />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
