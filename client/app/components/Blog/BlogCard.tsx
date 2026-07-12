"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineClock, HiOutlineChevronRight } from "react-icons/hi";

interface BlogCardProps {
  post: any;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/60 dark:bg-[#0b0c14]/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[#37a39a]/5"
    >
      {/* 3:2 ASPECT RATIO IMAGE CONTAINER */}
      <div className="relative w-full aspect-[3/2] bg-slate-100 dark:bg-white/5 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* CINEMATIC SHADOW OVERLAY LAYER (Fades the bottom of the image for text contrast) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* CATEGORY TEXT EMBEDDED IN IMAGE (Lower-Left Placement) */}
        <div className="absolute bottom-4 left-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white/90 font-Poppins drop-shadow-sm select-none">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#37a39a] mr-2" />
          {post.category}
        </div>
      </div>

      {/* CORE TEXT METRICS PANEL */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <HiOutlineClock size={14} className="text-[#37a39a]" />
            {post.readTime}
          </span>
          <span>{post.date}</span>
        </div>

        <h3 className="text-lg font-bold text-black dark:text-white line-clamp-2 group-hover:text-[#37a39a] transition-colors duration-200 font-Poppins leading-snug">
          {post.title}
        </h3>

        <p className="text-[13px] text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        {/* PROFILE IDENTIFICATION FOOTER */}
        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#37a39a] to-[#2bbca2] text-white flex items-center justify-center text-[10px] font-bold font-Poppins tracking-wider shadow-sm select-none shrink-0">
              MM
            </div>
            <span className="text-[12.5px] font-medium text-slate-700 dark:text-gray-300 truncate max-w-[150px]">
              {post.author.name}
            </span>
          </div>
          <div className="text-slate-400 group-hover:text-[#37a39a] group-hover:translate-x-0.5 transition-all duration-200">
            <HiOutlineChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
};