"use client";

import CourseDetailsPage from "../../components/Course/CourseDetailPage";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params?.id as string;


  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;