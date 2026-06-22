"use client";

import React, { type FC, useState } from "react";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type Props = {};

const ChangePassword: FC<Props> = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility states for individual fields
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      toast.error("Please fill all fields");
      return;
    }
    if (oldPassword === newPassword || oldPassword === confirmPassword) {
      toast.error("New password cannot be the same as old password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      // Using .unwrap() to handle success/error cleanly inline without useEffect
      await updatePassword({ oldPassword, newPassword }).unwrap();
      
      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-slate-100 dark:border-slate-800/80 transition-all duration-300">
      {/* Title Header */}
      <div className="w-full text-center mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white font-Poppins">
          Change Password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Secure your account with a strong password
        </p>
      </div>

      {/* Form Area */}
      <form className="space-y-6" onSubmit={passwordChangeHandler}>
        
        {/* Old Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Old Password
          </label>
          <div className="relative w-full">
            <input
              type={showOldPassword ? "text" : "password"}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full pl-4 pr-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white outline-none focus:border-[#37a39a] focus:ring-4 focus:ring-[#37a39a]/10 transition-all duration-200"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 focus:outline-none"
            >
              {showOldPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            New Password
          </label>
          <div className="relative w-full">
            <input
              type={showNewPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-4 pr-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white outline-none focus:border-[#37a39a] focus:ring-4 focus:ring-[#37a39a]/10 transition-all duration-200"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 focus:outline-none"
            >
              {showNewPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirm New Password
          </label>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-4 pr-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white outline-none focus:border-[#37a39a] focus:ring-4 focus:ring-[#37a39a]/10 transition-all duration-200"
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 focus:outline-none"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button Area */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-[800px]:w-[180px] h-12 flex items-center justify-center font-medium rounded-xl text-white bg-gradient-to-r from-[#37a39a] to-[#2c847c] hover:opacity-95 transition-all duration-300 shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;