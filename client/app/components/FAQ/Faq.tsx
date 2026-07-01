"use client";
import { useGetHeroDataQuery } from "../../../redux/features/layout/LayoutApi";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};

const FAQ = (props: Props) => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout?.faq || []);
    }
  }, [data]);

  const toggleQuestion = (id: string) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div className="w-full py-16 bg-transparent font-Poppins">
      <div className="w-[92%] md:w-[80%] max-w-4xl m-auto">
        {/* SECTION HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-50">
            Frequently Asked <span className="text-[#37a39a]">Questions</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Got questions? We've got answers. If you can't find what you are
            looking for, reach out to our team.
          </p>
        </div>

        {/* FAQ ACCORDION LIST */}
        <div className="space-y-4">
          {questions?.map((q) => {
            const isOpen = activeQuestion === q._id;
            return (
              <div
                key={q._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#0b0c14]/90"
              >
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left focus:outline-none group cursor-pointer"
                    onClick={() => toggleQuestion(q._id)}
                  >
                    <span
                      className={`font-semibold text-sm md:text-base tracking-tight transition-colors duration-200 ${
                        isOpen
                          ? "text-[#37a39a]"
                          : "text-slate-800 dark:text-slate-200 group-hover:text-[#37a39a]"
                      }`}
                    >
                      {q.question}
                    </span>
                    <span
                      className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-[#37a39a]/30 bg-[#37a39a]/10 text-[#37a39a] rotate-180"
                          : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-400"
                      }`}
                    >
                      {isOpen ? (
                        <HiMinus className="h-4 w-4" />
                      ) : (
                        <HiPlus className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </div>

                {/* SMOOTH COLLAPSIBLE CONTAINER */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs md:text-sm leading-relaxed text-slate-500 dark:text-slate-400 pr-4 border-l-2 border-[#37a39a]/40 pl-3">
                      {q.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
