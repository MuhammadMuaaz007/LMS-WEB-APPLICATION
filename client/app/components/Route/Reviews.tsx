import React from "react";
import Image from "next/image";
import BusinessImage from "../../../public/assets/business-img.png";
import ReviewCard from "../Review/ReviewCard";

const reviews = [
  {
    name: "Sarah Khan",
    role: "Frontend Developer",
    rating: 5,
    review:
      "The lessons were clear, practical, and easy to follow. I finally felt confident building projects on my own.",
  },
  {
    name: "Arjun Mehta",
    role: "Full Stack Engineer",
    rating: 5,
    review:
      "Great structure and real-world examples. The course flow made it simple to move from basics to advanced topics.",
  },
  {
    name: "Nina Roy",
    role: "UI Designer",
    rating: 4,
    review:
      "The content is modern, well organized, and easy to revisit. It feels polished and worth the time.",
  },
  {
    name: "Ravi Sharma",
    role: "Product Analyst",
    rating: 5,
    review:
      "I liked how the explanations stayed simple without losing depth. The platform makes learning feel smooth.",
  },
];

const marqueeReviews = [...reviews, ...reviews];

const Reviews = () => {
  return (
    <div className="w-full overflow-hidden py-16 md:py-20">
      <div className="w-[90%] m-auto max-w-7xl">
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Image
              src={BusinessImage}
              alt="Students sharing reviews"
              width={700}
              height={700}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="flex h-full flex-col justify-center">
            <span className="inline-flex w-23.75 items-center rounded-full bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#37a39a]">
              Reviews
            </span>

            <h3 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-slate-50">
              Our students are our strength.
              <span className="block text-[#37a39a]">
                See what they say about us.
              </span>
            </h3>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Real feedback from learners who used the platform to build skills,
              finish projects, and move closer to their goals.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-14">
          <div className="mb-10">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Student reviews
            </h4>
          </div>
          <div className="overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
            <div className="flex w-max gap-4 px-2 animate-[scroll-left_26s_linear_infinite] hover:[animation-play-state:paused]">
              {marqueeReviews.map((item, index) => (
                <ReviewCard
                  key={`${item.name}-${index}`}
                  name={item.name}
                  role={item.role}
                  rating={item.rating}
                  review={item.review}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Reviews;
