import Ratings from "@/app/utils/Ratings";
import React, { FC } from "react";

type ReviewCardProps = {
  name: string;
  role: string;
  rating: number;
  review: string;
};

const ReviewCard: FC<ReviewCardProps> = ({ name, role, rating, review }) => {
  return (
    <div className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Ratings rating={rating} />

      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {review}
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#37a39a]/10 text-sm font-semibold text-[#37a39a]">
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
