"use client";

import type { FC } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai"; // ✅ Added delete icon for bad entries

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
    updatedBenefits[index] = { ...updatedBenefits[index], title: value }; // ✅ Safe object cloning
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length > 1) {
      const updatedBenefits = [...benefits];
      updatedBenefits.splice(index, 1);
      setBenefits(updatedBenefits);
    }
  };

  const handlePrerequisitesChange = (index: number, value: string) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index] = { ...updatedPrerequisites[index], title: value }; // ✅ Safe object cloning
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const handleRemovePrerequisite = (index: number) => {
    if (prerequisites.length > 1) {
      const updatedPrerequisites = [...prerequisites];
      updatedPrerequisites.splice(index, 1);
      setPrerequisites(updatedPrerequisites);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    const hasValidBenefit = benefits?.some((benefit) => benefit?.title?.trim() !== "");
    const hasValidPrereq = prerequisites?.some((prereq) => prereq?.title?.trim() !== "");

    if (hasValidBenefit && hasValidPrereq) {
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
          {benefits?.map((benefit: any, index: number) => (
            <div key={index} className="flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder="You will be able to build a full stack LMS Platform..."
                required
                className={inputTheme}
                value={typeof benefit === "string" ? benefit : benefit?.title || ""} // ✅ Gracefully handles string arrays or object models from DB
                onChange={(e) => handleBenefitChange(index, e.target.value)}
              />
              {benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                  title="Remove Item"
                >
                  <AiOutlineDelete size={20} />
                </button>
              )}
            </div>
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
          {prerequisites?.map((prerequisite: any, index: number) => (
            <div key={index} className="flex items-center gap-2 w-full">
              <input
                type="text"
                required
                placeholder="You need basic knowledge of MERN stack"
                className={inputTheme}
                value={typeof prerequisite === "string" ? prerequisite : prerequisite?.title || ""} // ✅ Gracefully handles string arrays or object models from DB
                onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
              />
              {prerequisites.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePrerequisite(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                  title="Remove Item"
                >
                  <AiOutlineDelete size={20} />
                </button>
              )}
            </div>
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