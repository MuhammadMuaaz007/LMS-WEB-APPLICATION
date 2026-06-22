"use client";
import React, { useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import ProfileInfo from "./ProfileInfo";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut, useSession } from "next-auth/react";
import { Loader } from "../Loader/Loader";
import ChangePassword from "./ChangePassword";

type Props = {
  user: any;
};

const Profile: React.FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [logout, setLogout] = useState(false);

  const { isLoading: isLogoutLoading } = useLogoutQuery(undefined, {
    skip: !logout,
  });

  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const { data: session } = useSession();

  const logOutHandler = async () => {
    if (session) {
      await signOut({ redirect: false });
    }

    setLogout(true);
  };

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

  if (isLogoutLoading || logout) {
    return <Loader />;
  }
  return (
    <div className="w-[95%] md:w-[85%] flex gap-6 lg:gap-10 mx-auto min-h-screen py-12">
      {/* Sidebar Container */}
      <div
        className={`w-[70px] min-[800px]:w-[310px] h-fit sticky rounded-2xl border transition-all duration-300 ease-in-out
          dark:bg-slate-900/60 bg-white/80 backdrop-blur-md
          dark:border-slate-800/80 border-slate-200/60 
          shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)]
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
      {active === 1 && (
        <div className="w-full flex-1 transition-all duration-300 min-[800px]:mt-0">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full flex-1 transition-all duration-300 min-[800px]:mt-0">
          <ChangePassword />
        </div>
      )}
    </div>
  );
};

export default Profile;
