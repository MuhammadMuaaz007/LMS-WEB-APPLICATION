"use client";

import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/navigation"; // Changed from redirect
import React, { useEffect, use } from "react"; // Added 'use'

type Props = {
  params: Promise<{ id: string }>; // Typed as a Promise for Next.js App Router safety
};

const Page = ({ params }: Props) => {
  // 1. Safely unwrap the async params
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    // 2. Protect route if user loaded but course isn't purchased
    if (data?.user) {
      const isPurchased = data.user.courses.find(
        (item: any) => item._id === id
      );
      
      if (!isPurchased) {
        router.push("/"); // Clean client-side navigation
      }
    }
    
    // 3. Handle loading errors
    if (error) {
      router.push("/");
    }
  }, [data, error, id, router]);

  // 4. Added safe checks to ensure data exists before rendering content
  return (
    <>
      {isLoading || !data?.user ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user={data.user} />
        </div>
      )}
    </>
  );
};

export default Page;