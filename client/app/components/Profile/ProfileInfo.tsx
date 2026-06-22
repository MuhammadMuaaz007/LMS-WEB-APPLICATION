"use client";

import Image from "next/image";
import React, { type FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarDefault from "../../../public/assets/avatar.png";
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/redux/features/auth/authSlice";

type Props = {
  avatar: string;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  // Create a local state to hold the immediate base64 image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const dispatch = useDispatch();

  const [updateAvatar, { isSuccess, isError, isLoading, data: responseData }] =
    useUpdateAvatarMutation();

  const imageHanlder = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        updateAvatar({ avatar: base64Image });
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Avatar updated successfully");

      if (responseData?.user) {
        dispatch(
          userLoggedIn({
            user: responseData.user,
          }),
        );
      }
    }
    if (isError) {
      toast.error("Failed to update avatar");
      setImagePreview(null);
    }
  }, [isSuccess, isError, responseData, dispatch]);

  // Determine fallback image source securely
  const getImageSrc = () => {
    if (imagePreview) return imagePreview;
    if (user?.avatar?.url) return user.avatar.url;
    if (avatar) return avatar;
    return avatarDefault;
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-slate-100 dark:border-slate-800/80 transition-all duration-300">
      <div className="w-full flex justify-center mb-8">
        <div className="relative group">
          <div className="w-[120px] h-[120px] rounded-full p-1 border-2 border-[#37a39a] bg-white dark:bg-slate-900 transition-transform duration-300 group-hover:scale-[1.03] shadow-md overflow-hidden">
            <Image
              src={getImageSrc()}
              alt="User avatar"
              width={120}
              height={120}
              className="w-full h-full rounded-full object-cover"
              priority
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs font-medium">
                Uploading...
              </div>
            )}
          </div>

          <input
            type="file"
            name="avatar"
            id="avatar"
            className="hidden"
            onChange={imageHanlder}
            accept="image/png,image/jpg,image/jpeg,image/webp"
            disabled={isLoading}
          />

          <label
            htmlFor="avatar"
            className="absolute bottom-1 right-1 w-9 h-9 bg-slate-900 dark:bg-[#37a39a] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-slate-800 dark:hover:bg-[#2c847c] border border-slate-700 dark:border-slate-600 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <AiOutlineCamera size={18} />
          </label>
        </div>
      </div>

      {/* Main Profile Info Form Area */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white outline-none focus:border-[#37a39a] focus:ring-4 focus:ring-[#37a39a]/10 transition-all duration-200"
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-400 dark:text-slate-500">
            Email Address
          </label>
          <input
            type="email"
            readOnly
            value={user?.email || ""}
            className="w-full px-4 h-12 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-100/70 dark:bg-slate-950/80 text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed select-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
          <button
            type="submit"
            className="w-full min-[800px]:w-[180px] h-12 flex items-center justify-center font-medium rounded-xl text-white bg-gradient-to-r from-[#37a39a] to-[#2c847c] hover:opacity-95 transition-all duration-300 shadow-md active:scale-[0.98] cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
