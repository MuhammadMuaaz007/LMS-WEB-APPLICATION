import React from "react";
import Heading from "../../utils/Heading";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";
import DashBoardHero from "@/app/components/admin/DashBoardHero";
import CreateCourse from "@/app/components/admin/Course/CreateCourse";

type Props = {};
const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Create Course - SkillStack Admin"
        description="Create a new course for your students"
        keywords="Create Course, Education, Learning"
      />
      <div className="flex">
        <div className="min-[1500px]:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] ">
          <DashBoardHero />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default page;
