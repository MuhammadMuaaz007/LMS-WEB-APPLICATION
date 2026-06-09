'use client'
import React,{FC,useState} from 'react';
import Header from './components/Header';
import Hero from './components/Route/Hero';
// import Heading from './utils/Heading';

interface Props{
  name:string,
}

const Page:FC<Props>=(props)=>{
  const [open,setOpen]=useState(false);
  const [activeItem,setActiveItem]=useState(0);
  
  return(
    <div>
      {/* <Heading title="SKILLSTACK" description="SKILLSTACK is a platform for learning and practicing programming skills" keywords="React,Nextjs,Programming,Redux,Machine Learning,Nodejs,MERN" /> */}
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setActiveItem={setActiveItem}/>
      <Hero/>
    </div>
  )
}

export default Page