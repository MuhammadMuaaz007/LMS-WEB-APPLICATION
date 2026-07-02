import Link from "next/link";
import React from "react";
import { BiSend } from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-slate-200/60 bg-white/50 backdrop-blur-sm dark:border-white/5 dark:bg-[#0b0c14]/50 font-Poppins">
      {/* Outer wrapper matches exactly with header container geometry layout */}
      <div className="w-[92%] max-w-7xl mx-auto py-16">
        {/* TOP SECTION: BRAND & NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[22px] sm:text-[25px] font-semibold text-black dark:text-white tracking-tight transition-opacity hover:opacity-80"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#37a39a]" />
              SkillStack
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Empowering the next generation of developers with hands-on,
              production-ready tech education.
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col md:flex-row gap-8 justify-between items-start lg:items-center bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200/40 dark:border-white/5">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Subscribe to our newsletter
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get the latest courses and tech insights straight to your inbox.
              </p>
            </div>
            <form
              className="flex w-full md:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0b0c14] border border-slate-200 dark:border-white/10 outline-none text-sm w-full md:w-64 text-slate-800 dark:text-slate-100"
              />
              <button className="bg-[#37a39a] hover:bg-[#2d877f] text-white p-3 rounded-xl transition-all cursor-pointer shadow-sm shadow-[#37a39a]/20">
                <BiSend size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM SECTION: LINKS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              title: "About",
              links: [
                { n: "Our Story", h: "/about" },
                { n: "Privacy Policy", h: "/privacy-policy" },
                { n: "FAQ", h: "/faq" },
              ],
            },
            {
              title: "Quick Links",
              links: [
                { n: "Courses", h: "/courses" },
                { n: "Profile", h: "/profile" },
                { n: "About Us", h: "/about" },
              ],
            },
            {
              title: "Resources",
              links: [
                { n: "Blog", h: "#" },
                { n: "Community", h: "#" },
                { n: "Support", h: "#" },
              ],
            },
            {
              title: "Connect",
              links: [
                { n: "YouTube", h: "https://www.youtube.com/@StackMuaaz" },
                { n: "GitHub", h: "https://github.com/MuhammadMuaaz007" },
                {
                  n: "Instagram",
                  h: "https://instagram.com/being_muaaz_official/",
                },
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.h}
                      className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-colors duration-200"
                    >
                      {link.n}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 SkillStack Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400 dark:text-slate-500">
            <span className="cursor-pointer hover:text-[#37a39a] transition-colors">
              Terms of Service
            </span>
            <span className="cursor-pointer hover:text-[#37a39a] transition-colors">
              Cookies Settings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
