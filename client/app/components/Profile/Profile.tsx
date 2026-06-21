"use client";
import React, { useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const [scroll, setScroll] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  // Defaulted active to 1 so the "My Account" tab is selected by default
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const logOutHandler = () => {};

  // Safely manage the scroll listener inside a useEffect to prevent memory leaks
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-[95%] md:w-[85%] flex gap-6 lg:gap-10 mx-auto min-h-screen py-10">
      {/* Sidebar Container */}
      <div
        className={`w-[70px] min-[800px]:w-[310px] h-fit sticky rounded-2xl border transition-all duration-300 ease-in-out
          dark:bg-slate-900/80 bg-white/80 backdrop-blur-md
          dark:border-slate-800 border-slate-200/80 
          shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
          ${scroll ? "top-[100px]" : "top-[30px]"}`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[500px]">
        {active === 1 && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 border-slate-200 p-6 shadow-sm animate-fadeIn">
            {/* <ProfileInfo avatar={avatar} user={user} /> */}
            <h2 className="text-xl font-semibold dark:text-white text-slate-800">
              My Account Profile
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Manage your account information and preferences here.
            </p>
          </div>
        )}

        {active === 2 && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 border-slate-200 p-6 shadow-sm animate-fadeIn">
            {/* <ChangePassword /> */}
            <h2 className="text-xl font-semibold dark:text-white text-slate-800">
              Change Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Update your security credentials.
            </p>
          </div>
        )}

        {active === 3 && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 border-slate-200 p-6 shadow-sm animate-fadeIn">
            <h2 className="text-xl font-semibold dark:text-white text-slate-800">
              Enrolled Courses
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Access your active learning dashboards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
