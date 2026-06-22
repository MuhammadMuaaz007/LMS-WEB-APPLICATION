"use client";

import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
  AiOutlineClose,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .required("Please enter your password")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

const Login: FC<Props> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [login, { isLoading: isFormLoading }] = useLoginMutation();

  // Combine both loading states to disable buttons globally during any auth process
  const isAnyLoading = isFormLoading || isSocialLoading;

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      try {
        await login({ email, password }).unwrap();
        toast.success("Login successful!");
        setOpen(false);
      } catch (err: any) {
        toast.error(err?.data?.message || "Login failed!");
      }
    },
  });

  const { errors, touched, values, handleChange, handleBlur, handleSubmit } =
    formik;

  // Handle Social Login redirects cleanly
  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setIsSocialLoading(true);
      
      // Setting redirect: false allows us to inspect the response before any automated movement
      const result = await signIn(provider, { redirect: false, callbackUrl: "/" });
      
      if (result?.error) {
        toast.error(`Failed to connect with ${provider}`);
        setIsSocialLoading(false);
      } else if (result?.url) {
        toast.success("Redirecting to profile...");
        // Manually route to the final URL once NextAuth registers the intent
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Something went wrong with social login.");
      setIsSocialLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-6 bg-transparent rounded-2xl border border-gray-300/40 dark:border-slate-700/40 shadow-sm transition-colors duration-300">
      
      {/* Custom Loader Overlay */}
      {isSocialLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl animate-fade-in">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium font-Poppins text-slate-700 dark:text-slate-300">
            Connecting secure session...
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={isAnyLoading}
        onClick={() => setOpen(false)}
        aria-label="Close login form"
        className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <AiOutlineClose size={18} />
      </button>

      <h1 className="text-[25px] text-slate-800 dark:text-white font-[600] font-Poppins text-center pb-6 pr-6">
        Login with SkillStack
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-[14px] font-[500] font-Poppins text-slate-700 dark:text-slate-300 mb-2"
          >
            Enter Your Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            disabled={isAnyLoading}
            className={`w-full text-slate-900 dark:text-white bg-transparent border rounded-lg h-[44px] px-3 outline-none font-Poppins transition-colors ${
              errors.email && touched.email
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
            }`}
            value={values.email}
            placeholder="loginmail@gmail.com"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 dark:text-red-400 text-[13px] font-Poppins mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-[14px] font-[500] font-Poppins text-slate-700 dark:text-slate-300 mb-2"
          >
            Enter Your Password
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              id="password"
              disabled={isAnyLoading}
              className={`w-full text-slate-900 dark:text-white bg-transparent border rounded-lg h-[44px] pl-3 pr-10 outline-none font-Poppins transition-colors ${
                errors.password && touched.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
              }`}
              value={values.password}
              placeholder="********"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              onClick={() => !isAnyLoading && setShow((prev) => !prev)}
            >
              {show ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </div>
          </div>
          {errors.password && touched.password && (
            <p className="text-red-500 dark:text-red-400 text-[13px] font-Poppins mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnyLoading}
          className="w-full h-[44px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-Poppins font-[500] rounded-lg transition-all transform active:scale-[0.99] mt-2 shadow-sm flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          {isFormLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-300/40 dark:border-slate-700/40"></div>
        <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm font-Poppins">
          Or join with
        </span>
        <div className="flex-grow border-t border-gray-300/40 dark:border-slate-700/40"></div>
      </div>

      {/* Social Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={isAnyLoading}
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center w-full h-[44px] border border-gray-300/60 dark:border-slate-700/60 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FcGoogle size={22} />
        </button>

        <button
          type="button"
          disabled={isAnyLoading}
          onClick={() => handleSocialLogin("github")}
          className="flex items-center justify-center w-full h-[44px] border border-gray-300/60 dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <AiFillGithub size={22} />
        </button>
      </div>

      {/* Sign Up Redirect Link */}
      <p className="text-center text-sm font-Poppins text-slate-500 dark:text-slate-400 mt-6">
        Not a member?{" "}
        <span
          onClick={() => !isAnyLoading && setRoute("SignUp")}
          className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-[500]"
        >
          Sign up now
        </span>
      </p>
    </div>
  );
};

export default Login;