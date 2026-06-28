import React from "react";
import Heading from "../../../utils/Heading";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";
import DashBoardHero from "@/app/components/admin/DashBoardHero";
import EditCourse from "../../../components/admin/Course/EditCourse";

type Props = {
  params: Promise<{ id: string }>;
};

// ✅ 1. Turned this into an async function
const page = async ({ params }: Props) => {
  

  const { id } = await params;

  return (
    <div>
      <Heading
        title="Edit Course - SkillStack Admin"
        description="Edit an existing course for your students"
        keywords="Edit Course, Education, Learning"
      />
      <div className="flex">
        <div className="min-[1500px]:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashBoardHero />

          <EditCourse id={id} />
        </div>
      </div>
    </div>
  );
};

export default page;