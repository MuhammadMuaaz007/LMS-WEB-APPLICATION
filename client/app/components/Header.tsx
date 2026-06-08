"use client";
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
};
const Header: FC<Props> = ({ activeItem }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="w-full relative">
      <div
        className={`${active ? "dark:bg-opacity-50 bg-white dark:bg-linear-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-20 z-80 border-b dark:border-[#ffffff1c] shadow-xl transition duration-500" : "w-full border-b dark:border-[#ffffff1c] h-20 z-80 dark:shadow"}`}
      >
        <div className="w-[95%] min-[800px]:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-20 flex items-center justify-between p-3">
            <div>
              <Link
                href="/"
                className="text-[25px] font-Poppins font-medium text-black dark:text-white"
              >
                SkillStack
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
