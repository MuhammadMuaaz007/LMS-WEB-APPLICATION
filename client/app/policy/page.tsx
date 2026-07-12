"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Policy from "../components/Policy/Policy";


type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4); 
  const [route, setRoute] = useState("Login");

  return (
    <div className="bf-transparent min-h-screen transition-colors duration-300">
      <Heading
        title="Policy - SkillStack"
        description="Platform policies and terms of service for the SkillStack programming community."
        keywords="policy, terms of service, legal, privacy, skillstack"
      />
      
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      
      <div className="w-[92%] max-w-7xl mx-auto min-h-[80vh] mt-6">
        <Policy />
      </div>
      
      <Footer />
    </div>
  );
};

export default Page;