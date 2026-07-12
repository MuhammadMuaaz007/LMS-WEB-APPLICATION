"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import About from "../components/About/About";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  return (
    <div className=" bg-transparent min-h-screen text-black dark:text-white transition-colors duration-300">
      <Heading
        title="About Us - SkillStack"
        description="SkillStack is a high-performance modern learning ecosystem for scaling full-stack engineers."
        keywords="programming, mern, architecture, development, skills"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      {/* Standard uniform content area container block matching landing metrics alignment */}
      <div className="w-[92%] max-w-7xl mx-auto min-h-[80vh] mt-6">
        <About />
      </div>

      <Footer />
    </div>
  );
};

export default Page;
