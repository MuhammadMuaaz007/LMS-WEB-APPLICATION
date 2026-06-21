"use client";
import React, { FC, useEffect, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useSession } from "next-auth/react";

interface CustomProviderProps {
  children: React.ReactNode;
}

export const CustomProvider: FC<CustomProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Trigger loading query, skipping if next-auth is active
  const { isLoading } = useLoadUserQuery(undefined, {
    skip: !!session, 
  });

  // ✅ Force synchronization: This only runs in the browser AFTER the initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // If we haven't mounted yet, match the server's empty or structural output exactly
  if (!mounted) {
    return <>{children}</>;
  }

  // Once mounted, safely display the loading screen on the client side if necessary
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <p className="text-xl font-medium dark:text-white">Loading your experience...</p>
      </div>
    );
  }

  return <>{children}</>;
};