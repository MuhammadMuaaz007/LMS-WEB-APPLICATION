"use client";
import React from "react";
import AdminProtected from "../hooks/useAdminProtected";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/admin/sidebar/AdminSidebar";
import DashBoardHero from "../components/admin/DashBoardHero";


const page = () => {
  return (
<div>
  <AdminProtected>
    <Heading
      title={`SkillStack-Admin`}
      description="SkillStack is a platform for students to learn and get help from teachers"
      keywords="Programming , MERN ,REDUX , Machine Learning"
    />
    <div className="flex h-full">
      <AdminSidebar />
      {/* Offset content by sidebar width — collapsed (75px) on mobile, expanded (260px) on desktop */}
      <div className="ml-[75px] md:ml-[260px] w-full min-h-screen transition-all duration-300">
        <DashBoardHero />
      </div>
    </div>
  </AdminProtected>
</div>
  );
};

export default page;
