"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";

import Client1 from "../../../public/assets/client-1.jpg";
import Client2 from "../../../public/assets/client-2.jpg";
import Client3 from "../../../public/assets/client-3.jpg";
import HeroImage from "../../../public/assets/hero-banner-1.png";

type Props = {};

const Hero: FC<Props> = () => {
  const [search, setSearch] = useState("");

  const clients = [Client1, Client2, Client3];

  return (
    <section className="relative w-full overflow-hidden">
      {/* ✅ Soft Responsive Background Blobs (Better than circle) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] sm:w-[400px] lg:w-[600px] h-[250px] sm:h-[400px] lg:h-[600px] bg-blue-400/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[200px] sm:w-[300px] lg:w-[450px] h-[200px] sm:h-[300px] lg:h-[450px] bg-purple-400/20 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-14 md:py-20">

          {/* IMAGE */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src={HeroImage}
              alt="Hero Banner"
              priority
              className="
                w-full
                max-w-[280px]
                sm:max-w-[350px]
                md:max-w-[450px]
                lg:max-w-[550px]
                h-auto
                object-contain
                drop-shadow-lg
              "
            />
          </div>

          {/* CONTENT */}
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10">

            <h1 className="
              text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
              font-bold
              leading-tight
              text-gray-900
              dark:text-white
            ">
              Learn New Skills &{" "}
              <span className="text-blue-500">Grow Your Career</span>
            </h1>

            <p className="mt-5 text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              Explore high-quality online courses and build real-world skills
              from industry experts at your own pace.
            </p>

            {/* SEARCH */}
            <form className="mt-7 w-full max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-slate-800">
                <input
                  type="search"
                  placeholder="Search Courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    flex-1
                    px-4
                    sm:px-5
                    py-3
                    sm:py-4
                    bg-transparent
                    outline-none
                    text-gray-800
                    dark:text-white
                  "
                />

                <button
                  type="submit"
                  className="
                    px-4
                    sm:px-6
                    py-3
                    sm:py-4
                    bg-blue-500
                    hover:bg-blue-600
                    text-white
                    transition
                  "
                >
                  <BiSearch size={20} />
                </button>
              </div>
            </form>

            {/* TRUST */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {clients.map((client, i) => (
                  <Image
                    key={i}
                    src={client}
                    alt="client"
                    width={42}
                    height={42}
                    className="rounded-full border-2 border-white dark:border-slate-900"
                  />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                <span className="font-semibold text-blue-500">500K+</span>{" "}
                students trust us
                <Link href="/courses" className="ml-2 text-blue-500 hover:underline">
                  Explore Courses
                </Link>
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-8 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-500">500K+</h3>
                <p className="text-sm text-gray-500">Students</p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-500">50K+</h3>
                <p className="text-sm text-gray-500">Courses</p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-500">100+</h3>
                <p className="text-sm text-gray-500">Instructors</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;