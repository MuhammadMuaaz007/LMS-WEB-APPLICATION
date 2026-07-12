"use client";
import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Heading from "../../utils/Heading";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { HiOutlineArrowLeft, HiOutlineClock } from "react-icons/hi";
import { blogsData } from "../../data/blogData";

type Props = {
  params: Promise<{ slug: string }>;
};

const BlogPostReader = ({ params }: Props) => {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  // Query your exported array data matching the active URL slug parameter
  const post = blogsData.find((b) => b.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center font-Poppins bg-white dark:bg-[#0b0c14] text-black dark:text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Article Log Not Found</h2>
          <Link href="/blog" className="text-[#37a39a] font-medium underline">
            Return to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0b0c14] min-h-screen text-black dark:text-white transition-colors duration-300">
      <Heading
        title={`${post.title} - SkillStack Blog`}
        description={post.excerpt}
        keywords={`${post.category}, engineering, mern, architecture, skillstack`}
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={3}
        setRoute={setRoute}
        route={route}
      />

      <main className="w-[92%] max-w-3xl mx-auto pt-8 pb-24 font-Poppins">
        {/* Navigation Escape Route */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#37a39a] font-medium hover:opacity-85 transition-opacity mb-8"
        >
          <HiOutlineArrowLeft /> Back to logbook
        </Link>

        {/* HERO HEADER REGION */}
        <div className="space-y-4 mb-8">
          <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#37a39a] to-[#2bbca2] px-3 py-1 rounded-full shadow-sm">
            {post.category}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-gray-100 dark:border-white/5 py-4 mt-2">
            <div className="flex items-center gap-3">
              {/* MM AUTHOR INITIALS DISPLAY */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#37a39a] to-[#2bbca2] text-white flex items-center justify-center text-xs font-bold tracking-wider shadow-md select-none">
                MM
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {post.author.name}
                </h5>
                <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">
                  {post.author.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <HiOutlineClock className="text-[#37a39a]" />
                {post.readTime}
              </span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        {/* COVER COVER IMAGE PANEL */}
        <div className="relative w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-10 border border-gray-200/40 dark:border-white/5">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* MAIN BODY CONTENTS ITERATION LAYER */}
        <div className="text-[15px] md:text-[16.5px] leading-relaxed text-slate-700 dark:text-gray-300 space-y-6">
          {post.content.map((block, idx) => {
            if (block.type === "paragraph") {
              return (
                <p key={idx} className="whitespace-pre-line">
                  {block.text}
                </p>
              );
            }
            if (block.type === "subheading") {
              return (
                <h3
                  key={idx}
                  className="text-xl md:text-2xl font-bold text-black dark:text-white pt-4 tracking-wide"
                >
                  {block.text}
                </h3>
              );
            }
            if (block.type === "code") {
              return (
                <pre
                  key={idx}
                  className="p-5 rounded-xl bg-[#07080d] border border-gray-800 dark:border-white/5 font-mono text-[13.5px] text-teal-400 overflow-x-auto shadow-inner leading-relaxed [scrollbar-width:none]"
                >
                  <code>{block.text}</code>
                </pre>
              );
            }
            return null;
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostReader;
