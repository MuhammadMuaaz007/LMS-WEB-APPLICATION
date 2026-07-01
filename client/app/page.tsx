"use client";
import React, { FC, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Heading from "./utils/Heading";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import Faq from "./components/FAQ/Faq";
import Footer from "./components/Footer";
interface Props {
  name: string;
}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Heading
        title="SkillStack - Learn and Grow Your Skills"
        description="ELearning is the Platform for students to learn and get help from teachers"
        keywords="Programing,Mern,Ai,Ml"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <Hero />
      <Courses />
      <Reviews />
      <Faq />
      <Footer />
    </div>
  );
};

export default Page;
