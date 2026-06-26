"use client";
import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>(
    Array(courseContentData?.length || 0).fill(false),
  );
  const [activeSection, setActiveSection] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.push({ title: "", url: "" });
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    let newVideoSection = "";
    if (courseContentData.length > 0) {
      const lastVideoSection =
        courseContentData[courseContentData.length - 1].videoSection;
      if (lastVideoSection) newVideoSection = lastVideoSection;
    }
    const newContent = {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: newVideoSection,
      videoLength: "",
      links: [{ title: "", url: "" }],
    };
    setCourseContentData([...courseContentData, newContent]);
  };

  const addNewSection = () => {
    setActiveSection(activeSection + 1);
    const newContent = {
      videoUrl: "",
      title: "",
      description: "",
      videoLength: "",
      videoSection: `Untitled Section ${activeSection}`,
      links: [{ title: "", url: "" }],
    };
    setCourseContentData([...courseContentData, newContent]);
  };

  return (
    <div className="w-full max-w-[850px] mx-auto mt-6 md:mt-12 p-2 sm:p-4 font-Poppins">
      <form onSubmit={handleSubmit} className="space-y-6">
        {courseContentData?.map((item: any, index: number) => {
          // Rule to detect when to print a brand new Module Section title input header
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <div key={`content-${index}`} className="w-full block">

              {showSectionInput && (
                <div className="flex w-full items-center gap-2 mt-8 mb-4 group/section">
                  <input
                    type="text"
                    className={`text-[18px] md:text-[22px] font-semibold font-Poppins cursor-pointer text-slate-800 dark:text-gray-100 bg-transparent outline-none border-b border-transparent hover:border-gray-300 dark:hover:border-white/10 focus:border-[#37a39a] focus:dark:border-[#37a39a] transition-all py-1
                      ${item.videoSection === "Untitled Section" ? "w-[170px]" : "w-auto"}`}
                    value={item.videoSection}
                    onChange={(e) => {
                      const updatedData = [...courseContentData];
                      updatedData[index].videoSection = e.target.value;
                      setCourseContentData(updatedData);
                    }}
                  />
                  <BsPencil className="text-slate-400 group-hover/section:text-[#37a39a] transition-colors text-sm cursor-pointer" />
                </div>
              )}

              {/* CARD CONTAINER BLOCK */}
              <div className="w-full bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                {/* COLLAPSED ROW BAR HEADER */}
                <div className="flex w-full items-center justify-between select-none">
                  <div className="flex-1 min-w-0 pr-4">
                    {isCollapsed[index] && item.title ? (
                      <p className="font-medium text-slate-700 dark:text-gray-200 text-[15px] truncate">
                        {index + 1}. {item.title}
                      </p>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#37a39a]/90">
                        Lesson Video Item {index + 1}
                      </span>
                    )}
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-colors
                        ${
                          index > 0
                            ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                            : "text-slate-300 dark:text-gray-700 cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (index > 0) {
                          const updatedData = [...courseContentData];
                          updatedData.splice(index, 1);
                          setCourseContentData(updatedData);
                        }
                      }}
                    >
                      <AiOutlineDelete className="text-[18px]" />
                    </button>

                    <button
                      type="button"
                      className="p-2 rounded-lg text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
                      onClick={() => handleCollapseToggle(index)}
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <MdOutlineKeyboardArrowDown className="text-[22px]" />
                    </button>
                  </div>
                </div>

                {/* SLIDE DOWN FIELDS FORM CONTAINER */}
                {!isCollapsed[index] && (
                  <div className="mt-5 space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    {/* VIDEO TITLE */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-slate-500 dark:text-gray-400">
                        Video Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Introduction to Architecture Layouts..."
                        className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] focus:ring-1 focus:ring-[#37a39a] transition-all"
                        value={item.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].title = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* VIDEO URL */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-slate-500 dark:text-gray-400">
                        Video Url
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., https://vimeo.com/stream-id"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] focus:ring-1 focus:ring-[#37a39a] transition-all"
                        value={item.videoUrl}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoUrl = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* VIDEO RUNTIME TIMING */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-slate-500 dark:text-gray-400">
                        Video Length (in minutes)
                      </label>
                      <input
                        type="number"
                        placeholder="20"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] focus:ring-1 focus:ring-[#37a39a] transition-all"
                        value={item.videoLength}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoLength = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* VIDEO SUMMARY CONTEXT DESCRIPTION */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-slate-500 dark:text-gray-400">
                        Video Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe the content covered in this specific curriculum chapter..."
                        className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] focus:ring-1 focus:ring-[#37a39a] transition-all resize-y"
                        value={item.description}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].description = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* ADDON ATTACHMENT RESOURCE LINKS MAPPING */}
                    <div className="space-y-4 pt-2">
                      {item?.links.map((link: any, linkIndex: number) => (
                        <div
                          key={`link-${index}-${linkIndex}`}
                          className="p-4 bg-slate-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 rounded-xl space-y-3"
                        >
                          <div className="w-full flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 tracking-wide">
                              Resource Attachment Asset #{linkIndex + 1}
                            </span>
                            <button
                              type="button"
                              disabled={linkIndex === 0}
                              className={`p-1.5 rounded-md transition-colors
                                ${
                                  linkIndex === 0
                                    ? "text-slate-300 dark:text-gray-800 cursor-not-allowed"
                                    : "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                                }`}
                              onClick={() =>
                                linkIndex !== 0 &&
                                handleRemoveLink(index, linkIndex)
                              }
                            >
                              <AiOutlineDelete className="text-base" />
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Link Anchor Title (e.g., Download Github Repository Source)"
                            className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] transition-all"
                            value={link.title}
                            onChange={(e) => {
                              const updatedData = [...courseContentData];
                              updatedData[index].links[linkIndex].title =
                                e.target.value;
                              setCourseContentData(updatedData);
                            }}
                          />
                          <input
                            type="url"
                            placeholder="Target Destination URL Address (https://...)"
                            className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] transition-all"
                            value={link.url}
                            onChange={(e) => {
                              const updatedData = [...courseContentData];
                              updatedData[index].links[linkIndex].url =
                                e.target.value;
                              setCourseContentData(updatedData);
                            }}
                          />
                        </div>
                      ))}

                      {/* ADD RESOURCE BUTTON */}
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#37a39a] hover:text-[#2d857e] transition-colors py-1 px-2 hover:bg-[#37a39a]/5 rounded-lg"
                        onClick={() => handleAddLink(index)}
                      >
                        <BsLink45Deg className="text-sm" /> Add Reference URL
                        Link
                      </button>
                    </div>
                  </div>
                )}

                {/* APPEND CHILDFORM ACCORDION ITEM BUTTON */}
                {index === courseContentData.length - 1 && (
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm font-semibold text-[#37a39a] hover:text-[#2d857e] transition-all duration-200 bg-[#37a39a]/5 hover:bg-[#37a39a]/10 px-4 py-2 rounded-xl"
                      onClick={() => newContentHandler(item)}
                    >
                      <AiOutlinePlusCircle className="text-base" /> Add New
                      Video Content Item
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* REPLICATE STRUCTURAL SECTION WRAPPER ROW */}
        <div className="pt-2">
          <button
            type="button"
            className="flex items-center gap-2 text-[15px] font-semibold text-slate-700 dark:text-gray-200 hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-all duration-200 border border-dashed border-gray-300 dark:border-white/10 hover:border-[#37a39a] dark:hover:border-[#37a39a] w-full justify-center py-4 rounded-2xl bg-white/40 dark:bg-[#0b0c14]/40 hover:bg-[#37a39a]/5 dark:hover:bg-[#37a39a]/5"
            onClick={() => addNewSection()}
          >
            <AiOutlinePlusCircle className="text-base" /> Expand & Create
            Entirely New Module Section
          </button>
        </div>
      </form>

      {/* FLOW NAVIGATION FOOTER ACTION PILLS */}
      <div className="w-full flex items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200/60 dark:border-white/10">
        <button
          type="button"
          className="w-full sm:w-[150px] flex items-center justify-center h-[42px] border border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 font-medium text-sm rounded-xl transition-all duration-200 select-none"
          onClick={() => setActive(active - 1)}
        >
          Previous Step
        </button>
        <button
          type="button"
          className="w-full sm:w-[150px] flex items-center justify-center h-[42px] bg-[#37a39a] text-white font-medium text-sm rounded-xl transition-all duration-200 select-none shadow-md shadow-[#37a39a]/10 hover:bg-[#2d857e] hover:shadow-lg hover:shadow-[#37a39a]/20"
          onClick={() => {
            setActive(active + 1);
            handleCourseSubmit();
          }}
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default CourseContent;
