"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BlogCard } from "../components/Blog/BlogCard";
import { blogsData } from "../data/blogData"; // Wired up the database array directly

const BlogPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "NextJS", "Redux", "DevOps"];

  const filteredBlogs =
    activeCategory === "All"
      ? blogsData
      : blogsData.filter((b) => b.category === activeCategory);

  return (
    <div className="bg-white dark:bg-[#0b0c14] min-h-screen text-black dark:text-white transition-colors duration-300">
      <Heading
        title="Engineering Blog - SkillStack"
        description="Deep dives into full-stack architecture, next-gen systems, and code optimization guides."
        keywords="nextjs, redux toolkit, mern stack, web development blog"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={3}
        setRoute={setRoute}
        route={route}
      />

      <div className="text-center max-w-3xl mx-auto space-y-4 pt-8 md:pt-12 mb-12 px-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-tight">
          The Engineering{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37a39a] to-[#2bbca2]">
            Logbook
          </span>
        </h1>
        <p className="text-[15px] md:text-[16px] text-slate-500 dark:text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
          Technical breakdowns, framework optimization paths, and production
          strategies compiled directly by the SkillStack engineering team.
        </p>
      </div>

      <div className="w-[92%] max-w-7xl mx-auto border-b border-gray-200/60 dark:border-white/5 pb-5 flex flex-wrap gap-2.5">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`h-[36px] px-4 rounded-full font-Poppins text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer select-none
              ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-[#37a39a] to-[#2bbca2] text-white shadow-md shadow-[#37a39a]/15"
                  : "bg-gray-50 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/5 hover:border-[#37a39a]/50 hover:text-black dark:hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="w-[92%] max-w-7xl mx-auto min-h-[50vh] py-10">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No entries have been published under this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredBlogs.map((post, index) => (
              <BlogCard post={post} key={index} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
