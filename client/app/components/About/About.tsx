"use client";
import React from "react";

const About = () => {
  return (
    <div className="w-full text-slate-800 dark:text-gray-200 font-Poppins pb-12">
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-8 md:pt-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-tight">
          What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37a39a] to-[#2bbca2]">SkillStack</span>?
        </h1>
        <p className="text-[15px] md:text-[16px] text-slate-500 dark:text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
          We are a cutting-edge programming academy and collaborative ecosystem designed to take you from writing basic code to mastering complex engineering.
        </p>
      </div>

      {/* CORE VISION MATRIX PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="p-6 md:p-8 rounded-2xl border border-gray-200/60 bg-white/60 dark:border-white/5 dark:bg-[#0b0c14]/50 backdrop-blur-md space-y-3">
          <div className="h-2 w-12 rounded-full bg-[#37a39a]" />
          <h3 className="text-xl font-bold text-black dark:text-white pt-2">
            Our Core Mission
          </h3>
          <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-gray-400">
            Traditional education moves too slowly for modern technology stacks. SkillStack bridges the gap by shipping production-ready workflows directly to developers, breaking down high-level architectural barriers inline.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-gray-200/60 bg-white/60 dark:border-white/5 dark:bg-[#0b0c14]/50 backdrop-blur-md space-y-3">
          <div className="h-2 w-12 rounded-full bg-gradient-to-r from-[#37a39a] to-[#2bbca2]" />
          <h3 className="text-xl font-bold text-black dark:text-white pt-2">
            Built for Programmers
          </h3>
          <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-gray-400">
            Whether you are working with the MERN stack, microservices, next-gen architectures, or deep system deployment pipelines, our curriculum focuses entirely on experiential, project-first community collaboration.
          </p>
        </div>
      </div>

      {/* KEY ACADEMY METRICS ROW */}
      <div className="mt-12 p-6 rounded-2xl border border-gray-200/40 dark:border-white/5 bg-gray-50/50 dark:bg-white/4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { label: "Active Enrolled Students", value: "10K+" },
          { label: "Premium Course Guides", value: "150+" },
          { label: "Verified Project Reviews", value: "99.4%" },
          { label: "Direct Mentor Support", value: "24/7" },
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-bold text-[#37a39a]">
              {stat.value}
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-semibold">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* FOOTER CALL-TO-ACTION BLURB */}
      <div className="mt-16 text-center max-w-xl mx-auto py-6 border-t border-gray-200/50 dark:border-white/5">
        <h3 className="text-lg font-semibold text-black dark:text-white font-Poppins">
          Ready to scale up your professional stack?
        </h3>
        <p className="text-[13px] text-slate-500 dark:text-gray-400 mt-1">
          Explore our expert-curated live lecture series and join thousands of global developers today.
        </p>
      </div>
    </div>
  );
};

export default About;