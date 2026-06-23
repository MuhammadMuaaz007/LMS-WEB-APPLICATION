"use client";

import { type FC, useState, useRef, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { format } from "timeago.js";
import ThemeSwitcher from "../../../app/utils/ThemeSwitcher";

const DashboardHeader: FC = () => {
  // Local state managing open/close since props are removed
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Static placeholder data
  const staticNotifications = [
    {
      _id: "1",
      title: "New Message",
      message: "You have received a new message from John Doe.",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "System Update",
      message: "A new system update is available. Click here to update.",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      title: "Reminder",
      message: "Your meeting with the team starts in 30 minutes.",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "4",
      title: "New Comment",
      message: "Alice commented on your post: 'Great work!'",
      createdAt: new Date().toISOString(),
    },
  ];

  // Optional: Closes the notification dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={headerRef}
      className="flex items-center justify-end p-6 fixed top-5 right-0 left-[75px] md:left-[260px] z-[9998] pointer-events-none"
    >
      <div className="pointer-events-auto">
        <ThemeSwitcher />
      </div>

      <div
        className="relative cursor-pointer m-2 pointer-events-auto"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {staticNotifications.length}
        </span>
      </div>

      {open && (
        <div className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-[1000000000] rounded [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pointer-events-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3 font-semibold">
            Notifications
          </h5>

          {staticNotifications.map((item, index) => (
            <div
              className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] mb-1.5 rounded-lg overflow-hidden transition-all"
              key={item._id || index}
            >
              <div className="w-full flex items-center justify-between p-2">
                <p className="text-black dark:text-white font-medium text-[15px]">
                  {item.title}
                </p>
                <p className="text-teal-500 dark:text-[#3ccba0] text-[13px] font-medium cursor-pointer hover:underline">
                  Mark as read
                </p>
              </div>
              <p className="px-2 text-slate-700 dark:text-slate-300 text-[14px] leading-relaxed">
                {item.message}
              </p>
              <p className="p-2 text-slate-400 dark:text-slate-400 text-[12px]">
                {format(item.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
