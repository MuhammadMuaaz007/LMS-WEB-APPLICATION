import DashBoardHero from "@/app/components/admin/DashBoardHero";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/useAdminProtected";
import Heading from "@/app/utils/Heading";
import AllCourses from "../../components/admin/courses/AllCourses";


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
          <div className="ml-[75px] md:ml-[260px] w-full min-h-screen transition-all duration-300">
            <DashBoardHero />
            <AllCourses/>
          </div>

        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
