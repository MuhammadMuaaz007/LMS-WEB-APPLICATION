import React, { FC } from "react";
import Link from "next/link";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Blog", url: "/blog" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
  setOpen: (open: boolean) => void;
};

const NavItems: FC<Props> = ({ activeItem, isMobile, setOpen }) => {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden min-[800px]:flex">
        {navItemsData &&
          navItemsData.map((item, index) => (
            <Link key={index} href={item.url}>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                } text-[18px] px-6 font-Poppins font-normal`}
              >
                {item.name}
              </span>
            </Link>
          ))}
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className="min-[800px]:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href={"/"} passHref onClick={() => setOpen(false)}>
              <span
                className={`text-[25px] font-Poppins font-medium text-black dark:text-white`}
              >
                SkillStack
              </span>
            </Link>
          </div>

          {navItemsData &&
            navItemsData.map((i, index) => (
              <Link
                href={i.url}
                passHref
                key={index}
                onClick={() => setOpen(false)}
              >
                <span
                  className={`${
                    activeItem === index
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } block py-5 text-[18px] px-6 font-Poppins font-normal`}
                >
                  {i.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
