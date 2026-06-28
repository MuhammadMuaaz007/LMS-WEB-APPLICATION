"use client";

import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/LayoutApi";
import { type FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import Image from "next/image";

const EditHero: FC = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");


  const { data, isSuccess, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading }] = useEditLayoutMutation();

  useEffect(() => {
    if (isSuccess && data?.layout?.banner) {
      setTitle(data.layout.banner.title || "");
      setSubTitle(data.layout.banner.subTitle || "");
      setImage(data.layout.banner.image?.url || "");
    }
  }, [data, isSuccess]);


  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = async () => {
    try {
      await editLayout({ type: "Banner", image, title, subTitle }).unwrap();
      toast.success("Hero updated successfully!");
      refetch(); 
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update layout settings.");
    }
  };


  const textareaTheme =
    "w-full px-4 py-3 rounded-xl border border-gray-200/80 dark:border-white/10 bg-transparent text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:border-[#37a39a] focus:ring-1 focus:ring-[#37a39a] transition-all duration-200 resize-none leading-relaxed";

  return (
    <div className="w-full p-4 sm:p-6 md:p-10 font-Poppins box-border mt-14 md:mt-0 text-slate-800 dark:text-gray-100">
 
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Customize Portal Hero
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
          Modify the primary introduction banner graphics, headers, and
          description prompts on your main index page.
        </p>
      </div>

      {/* WORKSPACE GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        {/* LEFT COLUMN: HERO IMAGE DESIGN PREVIEWER */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative z-10 w-full max-w-[420px] mx-auto">
          <div className="w-full aspect-square relative rounded-2xl border border-gray-200/60 dark:border-white/10 bg-slate-50 dark:bg-[#111322] flex items-center justify-center p-4 shadow-inner group">
            {image ? (
              image.startsWith("data:") ? (
         
                <img
                  src={image}
                  alt="Banner Preview"
                  className="w-full h-full object-contain max-h-[350px]"
                />
              ) : (
                <Image
                  src={image}
                  alt="Banner Preview"
                  width={500}
                  height={350}
                  className="w-full h-full object-contain max-h-[350px]"
                  unoptimized
                />
              )
            ) : (
              <img
                src="/defaultThumbnail.svg"
                alt="Default Thumbnail"
                className="w-40 h-40 opacity-40 dark:opacity-20"
              />
            )}

            <input
              type="file"
              id="banner"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="banner"
              className="absolute bottom-4 right-4 p-3 rounded-xl bg-white dark:bg-[#0b0c14] border border-gray-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:text-[#37a39a] dark:hover:text-[#37a39a] hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center"
            >
              <AiOutlineCamera size={20} />
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT EDITOR FIELDS */}
        <div className="lg:col-span-7 flex flex-col space-y-6 relative z-10 w-full">
          {/* TITLE HEADER FIELD */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Main Landing Title Heading
            </label>
            <textarea
              className={`${textareaTheme} text-[20px] sm:text-[24px] font-bold tracking-tight font-Poppins h-[140px]`}
              placeholder="Improve Your Online Learning Experience Better Instantly"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={4}
            />
          </div>

          {/* SUBTITLE DESCRIPTION FIELD */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Secondary Description Subtitle
            </label>
            <textarea
              placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
              className={`${textareaTheme} text-sm text-slate-500 dark:text-gray-400 font-medium h-[110px]`}
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              rows={3}
            />
          </div>

          {/* ACTIONS CONTROL SAVE ROW */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-end">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 px-6 h-[42px] font-medium text-sm rounded-xl transition-all duration-200 select-none bg-[#37a39a] hover:bg-[#2d857e] text-white shadow-md shadow-[#37a39a]/10 disabled:bg-slate-100 dark:disabled:bg-white/5 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed`}
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isLoading ? "Saving changes..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHero;
