"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { useLayoutEffect } from "react";

interface ProtectedProps {
  children: React.ReactNode;
}

interface RootState {
  auth: {
    user: {
      role: string;
    } | null;
  };
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";

  useLayoutEffect(() => {
    if (!isAdmin) {
      redirect("/");
    }
  }, [isAdmin]);

  return isAdmin ? <>{children}</> : null;
}
