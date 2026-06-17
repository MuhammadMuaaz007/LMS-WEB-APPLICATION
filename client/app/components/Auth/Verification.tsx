"use client";

import { type FC, useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useActivationMutation } from "../../../redux/features/auth/authApi";
import { useSelector } from "react-redux";

const styles = {
  title: "text-2xl font-bold font-Poppins text-black dark:text-white",
  button:
    "bg-blue-600 text-white px-8 py-2.5 rounded-md font-Poppins transition-all duration-200",
};

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  0: string;
  1: string;
  2: string;
  3: string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verifyHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");

    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      toast.error("Please enter a complete 4-digit code");
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);

    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully!");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data as any;
        toast.error(
          errorData.message || "Activation failed. Please try again.",
        );
        setInvalidError(true);
      } else {
        console.log("Activation error:", error);
      }
    }
  }, [isSuccess, error, setRoute]);
  return (
    <div>
      {/* REMOVED LOCAL <Toaster /> TO PREVENT TOAST DUPLICATION & FREEZING */}
      <h1 className={`${styles.title} text-center`}>Verify your account</h1>

      {verificationSuccess ? (
        <div className="w-full flex items-center justify-center mt-6">
          <div className="w-[80px] h-[80px] rounded-full bg-blue-600 flex items-center justify-center">
            <VscWorkspaceTrusted size={40} className="text-white" />
          </div>
        </div>
      ) : null}

      {/* 4-Digit Input Container */}
      <div className="mt-10 flex items-center justify-center gap-4 max-w-sm mx-auto">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="text"
            placeholder="*"
            pattern="\d*"
            inputMode="numeric"
            maxLength={1}
            key={key}
            ref={inputRefs[index]}
            className={`w-14 h-14 sm:w-16 sm:h-16 bg-transparent border-[3px] rounded-[10px] text-center text-[20px] font-Poppins font-semibold outline-none text-black dark:text-white transition-all ${
              invalidError
                ? "animate-shake border-red-500"
                : "border-gray-400 focus:border-blue-600"
            }`}
            value={verifyNumber[Number(key) as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>

      <div className="w-full flex justify-center mt-10">
        <button
          className={`${styles.button} hover:bg-blue-700 w-full sm:w-auto`}
          onClick={verifyHandler}
        >
          Verify OTP
        </button>
      </div>

      <h5 className="text-center mt-6 text-[14px] font-Poppins text-gray-600 dark:text-gray-300">
        Go back to Sign in?{" "}
        <span
          className="text-blue-600 cursor-pointer underline font-medium"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
