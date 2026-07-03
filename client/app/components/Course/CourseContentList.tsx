import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const courseData = props.data || [];

  // Simple clean approach to get unique sections
  const videoSections: string[] = [];
  courseData.forEach((item: any) => {
    if (!videoSections.includes(item.videoSection)) {
      videoSections.push(item.videoSection);
    }
  });

  const toggleSection = (section: string) => {
    if (visibleSections.includes(section)) {
      setVisibleSections(visibleSections.filter((s) => s !== section));
    } else {
      setVisibleSections([...visibleSections, section]);
    }
  };

  return (
    <div
      className={`w-full ${!props.isDemo && "ml-[-30px] min-h-screen sticky top-24 left-0 z-30"}`}
    >
      {videoSections.map((section: string) => {
        const isSectionVisible = visibleSections.includes(section);

        // Filter videos belonging strictly to this accordion segment
        const sectionVideos = courseData.filter(
          (item: any) => item.videoSection === section,
        );
        const sectionVideoCount = sectionVideos.length;

        // Calculate total section duration math cleanly
        const sectionVideoLength = sectionVideos.reduce(
          (total: number, item: any) => total + item.videoLength,
          0,
        );
        const sectionContentHours = (sectionVideoLength / 60).toFixed(2);

        return (
          <div
            className="transition-all border-b border-slate-200/60 dark:border-white/5 last:border-b-0"
            key={section}
          >
            {/* Accordion Header */}
            <div
              className="w-full flex justify-between items-center cursor-pointer select-none group p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
              onClick={() => toggleSection(section)}
            >
              <div className="space-y-1">
                <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white transition-colors group-hover:text-[#37a39a]">
                  {section}
                </h2>
                <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {sectionVideoCount} Lessons ·{" "}
                  {sectionVideoLength < 60
                    ? `${sectionVideoLength} minutes`
                    : `${sectionContentHours} hours`}
                </h5>
              </div>
              <button className="text-slate-600 dark:text-slate-400 transition-colors group-hover:text-[#37a39a] p-1">
                {isSectionVisible ? (
                  <BsChevronUp size={18} />
                ) : (
                  <BsChevronDown size={18} />
                )}
              </button>
            </div>

            {/* Accordion Content Panel */}
            {isSectionVisible && (
              <div className="w-full bg-slate-50/40 dark:bg-[#0b0c14]/20 px-4 pb-4 space-y-1">
                {sectionVideos.map((item: any, index: number) => {
                  // SIMPLIFIED INDEXING: Find the global video item number instantly from your original data array
                  const videoIndex = courseData.indexOf(item);
                  const contentLength = (item.videoLength / 60).toFixed(2);
                  const isActive = videoIndex === props.activeVideo;

                  return (
                    <div
                      className={`w-full rounded-xl transition-all p-3 flex flex-col gap-1 cursor-pointer ${
                        isActive
                          ? "bg-slate-900 dark:bg-slate-800 text-white shadow-xs"
                          : "hover:bg-slate-100/80 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                      }`}
                      key={item._id || index}
                      onClick={() =>
                        props.isDemo ? null : props?.setActiveVideo(videoIndex)
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          <MdOutlineOndemandVideo
                            size={18}
                            className={
                              isActive ? "text-[#1cdada]" : "text-[#37a39a]"
                            }
                          />
                        </div>
                        <h1 className="text-sm font-medium break-words leading-relaxed">
                          {item.title}
                        </h1>
                      </div>

                      <h5
                        className={`pl-[31px] text-[11px] font-medium tracking-wide ${isActive ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}
                      >
                        {item.videoLength > 60
                          ? `${contentLength} hours`
                          : `${item.videoLength} minutes`}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
