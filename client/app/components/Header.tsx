"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/avatar.png";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, setRoute, open }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const { data } = useSession();
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const { isLoading: userLoading, data: loadUserData } = useLoadUserQuery(
    undefined,
    {
      skip: !!user,
    },
  );

  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const socialAuthCalled = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 85);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (openSidebar) {
      const id = requestAnimationFrame(() => setSidebarVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setSidebarVisible(false);
    }
  }, [openSidebar]);

  const closeSidebar = () => {
    setSidebarVisible(false);
    setTimeout(() => setOpenSidebar(false), 300);
  };

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (userLoading) return;

    if (!user && !loadUserData?.user && data && !socialAuthCalled.current) {
      socialAuthCalled.current = true;
      socialAuth({
        email: data?.user?.email as string,
        name: data?.user?.name as string,
        avatar: data.user?.image as string,
      });
    }
    if (data === null && isSuccess && !user) {
      setLogout(true);
    }
  }, [data, user, userLoading, loadUserData, socialAuth]);

  useEffect(() => {
    if (isSuccess && data === null) {
      toast.success("login successfully");
    }
  }, [isSuccess]);

  return (
    <div className="w-full relative">
      <header
        className={`fixed top-0 left-0 w-full h-20 z-[80] transition-all duration-300 ${
          active
            ? "bg-white/80 dark:bg-[#0b0c14]/80 backdrop-blur-md shadow-md border-b border-gray-200/60 dark:border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="w-[92%] max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[22px] sm:text-[25px] font-Poppins font-semibold text-black dark:text-white tracking-tight transition-opacity hover:opacity-80"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#37a39a]" />
            SkillStack
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden min-[800px]:flex items-center">
              <NavItems
                activeItem={activeItem}
                isMobile={false}
                setOpen={setOpen}
              />
            </div>

            <ThemeSwitcher />

            {user ? (
              <Link
                href={"/profile"}
                className="hidden min-[800px]:block shrink-0"
              >
                <Image
                  src={user.avatar ? user.avatar.url : avatar}
                  alt="profile"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-transparent transition-all hover:ring-[#37a39a]/60"
                  style={{
                    border: activeItem === 5 ? "2px solid #37a39a" : "none",
                  }}
                />
              </Link>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="hidden min-[800px]:flex items-center justify-center w-9 h-9 rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Login"
              >
                <HiOutlineUserCircle size={24} />
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setOpenSidebar(true)}
              className="min-[800px]:hidden flex items-center justify-center w-9 h-9 rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <HiOutlineMenuAlt3 size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* spacer so content doesn't sit under the fixed header */}
      <div className="h-20" />

      {/* Mobile sidebar */}
      {openSidebar && (
        <div
          className={`fixed inset-0 w-full h-screen z-[99999] transition-opacity duration-300 ${
            sidebarVisible ? "opacity-100 bg-black/40" : "opacity-0 bg-black/0"
          }`}
          onClick={handleClose}
          id="screen"
        >
          <div
            className={`fixed top-0 right-0 h-screen w-[80%] max-w-[340px] bg-white dark:bg-[#0b0c14] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
              sidebarVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-5 h-20 border-b border-gray-200 dark:border-white/10">
              <span className="text-[20px] font-Poppins font-semibold text-black dark:text-white">
                SkillStack
              </span>
              <button
                onClick={closeSidebar}
                className="w-9 h-9 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <HiX size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4">
              <NavItems
                activeItem={activeItem}
                isMobile={true}
                setOpen={setOpenSidebar}
              />
            </div>

            <div className="px-5 py-4 border-t border-gray-200 dark:border-white/10">
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-3"
                  onClick={closeSidebar}
                >
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt="profile"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-black dark:text-white">
                    View profile
                  </span>
                </Link>
              ) : (
                <button
                  className="flex items-center gap-3 w-full"
                  onClick={() => {
                    setOpen(true);
                    closeSidebar();
                  }}
                >
                  <HiOutlineUserCircle
                    size={22}
                    className="text-black dark:text-white"
                  />
                  <span className="text-sm font-medium text-black dark:text-white">
                    Login / Sign up
                  </span>
                </button>
              )}

              <p className="text-xs mt-4 text-gray-500 dark:text-gray-400">
                Copyright © 2023 SkillStack
              </p>
            </div>
          </div>
        </div>
      )}

      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              route={route}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route === "SignUp" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              route={route}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              route={route}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
