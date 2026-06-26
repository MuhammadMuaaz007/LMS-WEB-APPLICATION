"use client";

import type { FC } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlusCircle } from "react-icons/ai";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index: number, value: string) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };
  // it checks if the benefits and prerequisites arrays have at least one non-empty title before allowing the user to proceed to the next step. If either array is empty, it shows an error toast message.
  const handleOptions = () => {
    if (
      benefits.some((benefit) => benefit.title.trim() !== "") &&
      prerequisites.some((prereq) => prereq.title.trim() !== "")
    ) {
      setActive(active + 1);
    } else {
      toast.error(
        "Please fill at least one benefit and prerequisite to continue!",
      );
    }
  };

  // Consistent Theme styling classes
  const labelTheme =
    "text-lg font-semibold tracking-wide text-slate-800 dark:text-slate-200 block mb-3 font-Poppins";
  const inputTheme =
    "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200";

  return (
    <div className="max-w-4xl mx-auto my-12 px-4 space-y-10">
      {/* Benefits Section */}
      <div className="space-y-3">
        <label className={labelTheme}>
          What are the benefits for students in this course?
        </label>

        <div className="space-y-3">
          {benefits.map((benefit: any, index: number) => (
            <input
              type="text"
              key={index}
              placeholder="You will be able to build a full stack LMS Platform..."
              required
              className={inputTheme}
              value={benefit.title}
              onChange={(e) => handleBenefitChange(index, e.target.value)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddBenefit}
          className="inline-flex items-center gap-2 mt-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium text-sm transition-colors cursor-pointer group"
        >
          <AiOutlinePlusCircle className="text-2xl group-hover:scale-110 transition-transform" />
          <span>Add Benefit</span>
        </button>
      </div>

      {/* Prerequisites Section */}
      <div className="space-y-3">
        <label className={labelTheme}>
          What are the prerequisites for starting this course?
        </label>

        <div className="space-y-3">
          {prerequisites.map((prerequisite: any, index: number) => (
            <input
              type="text"
              key={index}
              placeholder="You need basic knowledge of MERN stack"
              required
              className={inputTheme}
              value={prerequisite.title}
              onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddPrerequisites}
          className="inline-flex items-center gap-2 mt-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium text-sm transition-colors cursor-pointer group"
        >
          <AiOutlinePlusCircle className="text-2xl group-hover:scale-110 transition-transform" />
          <span>Add Prerequisite</span>
        </button>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={prevButton}
          className="w-full sm:w-[160px] h-[44px] flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          Previous Step
        </button>

        <button
          type="button"
          onClick={handleOptions}
          className="w-full sm:w-[160px] h-[44px] flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm shadow-teal-600/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default CourseData;
