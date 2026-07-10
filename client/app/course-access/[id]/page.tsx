"use client";

import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const Page = ({ params }: Props) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const { isLoading, error, data, isFetching } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    // Wait until the authentication query is completely finished loading
    if (isLoading || isFetching) return;

    // 1. If there's an error, or no user data exists at all, boot them to home/login
    if (error || !data?.user) {
      router.push("/");
      return;
    }

    // 2. If user exists, verify they purchased this specific course layout
    if (data?.user) {
      const isPurchased = data.user.courses?.some(
        (item: any) => item._id === id
      );
      
      if (!isPurchased) {
        router.push("/");
      }
    }
  }, [data, error, isLoading, isFetching, id, router]);

  // Prevent ANY page layout leakage by returning a full blank screen with loader if not fully authed
  if (isLoading || isFetching || !data?.user) {
    return (
      <div className="fixed inset-0 z-[99999] bg-white dark:bg-[#0b0c14] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Render the protected content once secure validation passes
  return (
    <div>
      <CourseContent id={id} user={data.user} />
    </div>
  );
};

export default Page;