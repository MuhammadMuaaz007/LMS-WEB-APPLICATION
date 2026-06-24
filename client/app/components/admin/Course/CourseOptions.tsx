"use client"

import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Data",
    "Course Content",
    "Course Preview",
  ];

  const handleStepClick = (index: number) => {
    // ONLY allow clicking if it's a previous step or the current active step
    // Forward steps can only be unlocked by pressing the form's "Next" button
    if (index <= active) {
      setActive(index);
    }
  };

  return (
    <div className="w-full flex flex-row md:flex-col justify-center md:justify-start items-center md:items-start gap-x-6 gap-y-1 md:gap-1">
      {options.map((option: string, index: number) => {
        const isCompleted = active > index;
        const isActive = active === index;
        const isForwardStep = index > active;

        return (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center md:items-start group relative pb-0 md:pb-8 last:pb-0
              ${isForwardStep ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            onClick={() => handleStepClick(index)}
          >
            {/* Connecting Lines */}
            {index !== options.length - 1 && (
              <>
                {/* Desktop Vertical Line */}
                <div
                  className={`absolute hidden md:block left-[17px] top-[36px] bottom-0 w-[2px] transition-colors duration-300
                    ${isCompleted ? "bg-[#37a39a]" : "bg-gray-200 dark:bg-white/10"}
                  `}
                />
                {/* Mobile Horizontal Connecting Line */}
                <div
                  className={`absolute block md:hidden left-[36px] w-[28px] top-[18px] h-[2px] transition-colors duration-300 z-0
                    ${isCompleted ? "bg-[#37a39a]" : "bg-gray-200 dark:bg-white/10"}
                  `}
                />
              </>
            )}

            {/* Step Circle Indicator */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 font-semibold font-Poppins text-sm
                  ${
                    isCompleted
                      ? "bg-[#37a39a] border-[#37a39a] text-white shadow-md shadow-[#37a39a]/20"
                      : isActive
                      ? "bg-[#37a39a]/10 dark:bg-[#37a39a]/15 border-[#37a39a] text-[#37a39a]"
                      : "bg-transparent border-gray-200 dark:border-white/10 text-slate-400 dark:text-gray-500"
                  }
                `}
              >
                {isCompleted ? (
                  <IoMdCheckmark className="text-[18px] stroke-[2]" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            </div>

            {/* Step Title Label */}
            <div className="hidden md:block pl-4 pt-1.5 flex-1 min-w-0 transition-all duration-200">
              <h5
                className={`text-[13px] lg:text-[14px] font-Poppins font-medium tracking-wide transition-colors duration-200 select-none truncate lg:whitespace-nowrap
                  ${
                    isActive
                      ? "text-[#37a39a] font-semibold"
                      : isCompleted
                      ? "text-slate-800 dark:text-gray-200"
                      : "text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300"
                  }
                  ${isForwardStep && "group-hover:text-slate-400 dark:group-hover:text-gray-500"}
                `}
              >
                {option}
              </h5>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseOptions;