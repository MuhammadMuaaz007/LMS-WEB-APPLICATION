"use client";

import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/LayoutApi";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { HiMinus, HiPlus } from "react-icons/hi";
import { toast } from "react-hot-toast";
import Loader from "../../Loader/Loader";

type Props = {};

const EditFAQ = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading: isEditLoading }] = useEditLayoutMutation();

  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFaqId, setSelectedCourseId] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (data?.layout?.faq && !isLoaded) {
      setQuestions(data.layout.faq);
      setIsLoaded(true);
    }
  }, [data, isLoaded]);

  const toggleQuestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q)),
    );
  };

  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q)),
    );
  };

  const handleAddFAQ = () => {
    const newFaqItem = {
      _id: Math.random().toString(36).substring(2, 9),
      question: "",
      answer: "",
    };
    setQuestions([...questions, newFaqItem]);
    setActiveQuestion(newFaqItem._id);
  };

  const handleDeleteConfirm = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q._id !== selectedFaqId),
    );
    if (activeQuestion === selectedFaqId) setActiveQuestion(null);
    setDeleteModalOpen(false);
    setSelectedCourseId("");
    toast.success("FAQ item removed from layout draft.");
  };

  const isDataChanged =
    JSON.stringify(data?.layout?.faq) !== JSON.stringify(questions);

  const handleSave = async () => {
    const hasEmptyFields = questions.some(
      (q) => !q.question.trim() || !q.answer.trim(),
    );
    if (hasEmptyFields) {
      toast.error(
        "Please fill out all Question and Answer fields before saving!",
      );
      return;
    }

    try {
      await editLayout({
        type: "FAQ",
        faq: questions.map(({ question, answer }) => ({ question, answer })),
      }).unwrap();

      toast.success("FAQ structure synchronized successfully!");
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update FAQ layout config settings.",
      );
    }
  };

  const textareaTheme =
    "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200/80 dark:border-white/10 bg-transparent text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:border-[#37a39a] focus:ring-1 focus:ring-[#37a39a] transition-all duration-200 resize-y leading-relaxed";

  return (
    <div className="w-full p-4 sm:p-6 md:p-10 font-Poppins box-border mt-20 md:mt-20  text-slate-800 dark:text-gray-100">
      <div className="mb-8 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Platform FAQ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Configure accordion question lines, edit responsive guidelines, and
            synchronize active system documentation items.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddFAQ}
          className="flex items-center justify-center gap-2 px-5 h-[40px] bg-[#37a39a]/10 hover:bg-[#37a39a]/20 text-[#37a39a] text-sm font-semibold rounded-xl transition-all duration-200 select-none whitespace-nowrap w-fit self-start sm:self-auto"
        >
          <AiOutlinePlusCircle size={18} />
          <span>Add New FAQ</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-[40vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {questions?.length > 0 ? (
            <div className="bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm divide-y divide-gray-100 dark:divide-white/[0.04]">
              {questions.map((q: any, index: number) => {
                const isOpen = activeQuestion === q._id;

                return (
                  <div
                    key={q._id}
                    className="py-6 first:pt-0 last:pb-0 group/row"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-2 w-full pr-2">
                          <span className="text-xs font-mono font-bold text-slate-400 select-none">
                            #{index + 1}
                          </span>
                          <input
                            type="text"
                            placeholder="Enter FAQ Question string line heading..."
                            value={q.question}
                            onChange={(e) =>
                              handleQuestionChange(q._id, e.target.value)
                            }
                            className="w-full bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-white/10 focus:border-[#37a39a] focus:dark:border-[#37a39a] outline-none text-sm sm:text-base font-semibold text-slate-800 dark:text-gray-100 transition-all py-1"
                          />
                          <BsPencil className="text-slate-300 dark:text-gray-600 group-hover/row:text-slate-400 dark:group-hover/row:text-gray-400 text-xs flex-shrink-0" />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
                        {/* ✅ Open Modal warning before splicing state list */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseId(q._id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-150 cursor-pointer"
                          title="Delete FAQ Item"
                        >
                          <AiOutlineDelete size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleQuestion(q._id)}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            isOpen
                              ? "bg-[#37a39a]/10 text-[#37a39a]"
                              : "text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5"
                          }`}
                        >
                          {isOpen ? (
                            <HiMinus size={16} />
                          ) : (
                            <HiPlus size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div
                      className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-4"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      <div className="overflow-hidden min-h-0 pl-6 space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Response Explanation Text
                        </label>
                        <textarea
                          rows={3}
                          value={q.answer}
                          onChange={(e) =>
                            handleAnswerChange(q._id, e.target.value)
                          }
                          placeholder="Provide details answering this system prompt entry detail..."
                          className={textareaTheme}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full py-16 bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl text-center shadow-sm">
              <p className="text-sm text-slate-400 dark:text-gray-500 font-medium mb-4">
                No active FAQ documentation objects configured in layout storage
                rulesets.
              </p>
              <button
                type="button"
                onClick={handleAddFAQ}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#37a39a] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#37a39a]/10"
              >
                Create First FAQ Item
              </button>
            </div>
          )}

          {/* GLOBAL TRANSACTION SAVE STRIP FOOTER ROW */}
          {questions?.length > 0 && (
            <div className="w-full flex items-center justify-end pt-4">
              <button
                type="button"
                disabled={!isDataChanged || isEditLoading}
                onClick={handleSave}
                className={`flex items-center justify-center gap-2 px-6 h-[42px] font-medium text-sm rounded-xl transition-all duration-200 select-none ${
                  isDataChanged && !isEditLoading
                    ? "bg-[#37a39a] hover:bg-[#2d857e] text-white shadow-md shadow-[#37a39a]/10 cursor-pointer animate-fadeIn"
                    : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                {isEditLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>
                  {isEditLoading
                    ? "Saving layout updates..."
                    : "Save Layout Configuration"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}


      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[400px] bg-white dark:bg-[#0b0c14] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl p-6 text-center animate-fadeIn">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineDelete size={22} />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Remove FAQ Item
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-6">
              Are you sure you want to drop this item? This change can be
              finalized or discarded before executing a cloud database save
              sequence.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedCourseId("");
                }}
                className="w-1/2 h-[40px] text-xs font-medium text-slate-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              >
                No, Keep Item
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="w-1/2 h-[40px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-rose-600/10 cursor-pointer"
              >
                Yes, Remove FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFAQ;
