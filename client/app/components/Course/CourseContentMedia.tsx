"use client";

import CoursePlayer from "@/app/utils/CoursePlayer";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
} from "../../../redux/features/courses/coursesApi";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true },
  );

  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionCreationLoading },
  ] = useAddNewQuestionMutation();
  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();
  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();
  const [
    addReplyInReview,
    {
      isSuccess: replySuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation();

  const course = courseData?.course;
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id,
  );

  const handleQuestion = async () => {
    if (question.length === 0) {
      toast.error("Question can't be empty");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  const handleAnswerSubmit = async () => {
    if (answer.trim() === "") {
      toast.error("Answer cannot be empty");
      return;
    }
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      toast.success("Question added successfully");
      socketId.emit("notification", {
        title: "New Question Received ",
        message: `You have a new Question from ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Reply added successfully");
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: `New Question Reply Received`,
          message: `You have a new question reply in ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }
    if (error && "data" in error) {
      toast.error((error as any).data.message);
    }
    if (answerError && "data" in answerError) {
      toast.error((answerError as any).data.message);
    }
    if (reviewSuccess) {
      setReview("");
      setRating(1);
      toast.success("Review added successfully");
      courseRefetch();
      socketId.emit("notification", {
        title: "New Review Received ",
        message: `${user?.name} has given a review in ${course?.name}`,
        userId: user._id,
      });
    }
    if (reviewError && "data" in reviewError) {
      toast.error((reviewError as any).data.message);
    }
    if (replySuccess) {
      setReply("");
      setIsReviewReply(false);
      toast.success("Reply in Review added successfully");
      courseRefetch();
    }
    if (replyError && "data" in replyError) {
      toast.error((replyError as any).data?.message);
    }
  }, [
    isSuccess,
    error,
    answerSuccess,
    answerError,
    reviewSuccess,
    reviewError,
    replySuccess,
    replyError,
    courseRefetch,
    refetch,
  ]);

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Reply can't be empty");
      } else {
        addReplyInReview({ comment: reply, courseId: id, reviewId });
      }
    }
  };

  return (
    <div className="w-[92%] max-w-6xl py-6 mx-auto font-Poppins text-slate-800 dark:text-slate-200">
      {/* VIDEO PLAYER PANEL */}
      <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-lg border border-slate-200/40 dark:border-white/5">
        <CoursePlayer
       
          videoUrl={data[activeVideo]?.videoUrl}
        />
      </div>

      {/* NAVIGATION PLAYER ACTIONS */}
      <div className="w-full flex items-center justify-between my-5">
        <button
          disabled={activeVideo === 0}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-xs md:text-sm tracking-wide transition-all border border-slate-200 bg-white shadow-xs dark:border-white/10 dark:bg-slate-900 cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft size={16} className="text-[#37a39a]" />
          Prev Lesson
        </button>

        <button
          disabled={data.length - 1 === activeVideo}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-xs md:text-sm tracking-wide transition-all text-white bg-gradient-to-r from-[#37a39a] to-blue-600 hover:opacity-95 shadow-sm shadow-[#37a39a]/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() =>
            setActiveVideo(
              data.length - 1 === activeVideo ? activeVideo : activeVideo + 1,
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight size={16} />
        </button>
      </div>

      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
        {data[activeVideo].title}
      </h1>

      {/* TAB NAVIGATION HEADER */}
      <div className="w-full mt-6 p-1 flex items-center justify-between border border-slate-200/60 bg-slate-50/80 dark:bg-[#0b0c14]/60 rounded-2xl dark:border-white/5 shadow-xs backdrop-blur-md">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <button
            key={index}
            className={`flex-1 py-3 text-center rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              activeBar === index
                ? "bg-white text-[#37a39a] shadow-xs dark:bg-white/10 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS PANELS */}
      <div className="mt-6">
        {/* OVERVIEW PANEL */}
        {activeBar === 0 && (
          <div className="p-5 md:p-6 bg-white dark:bg-[#0b0c14]/40 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xs">
            <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {data[activeVideo]?.description ||
                "No lesson description provided."}
            </p>
          </div>
        )}

        {/* RESOURCES PANEL */}
        {activeBar === 1 && (
          <div className="p-5 md:p-6 bg-white dark:bg-[#0b0c14]/40 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xs space-y-4">
            {data[activeVideo]?.links?.length > 0 ? (
              data[activeVideo]?.links.map((item: any, index: number) => (
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-white/4 rounded-xl border border-slate-100 dark:border-transparent"
                  key={index}
                >
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {item.title || "Reference Link"}
                  </h4>
                  <a
                    className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.url}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                No external resource material added for this lecture.
              </p>
            )}
          </div>
        )}

        {/* Q&A PANEL */}
        {activeBar === 2 && (
          <div className="space-y-6">
            <div className="p-5 bg-white dark:bg-[#0b0c14]/40 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xs space-y-4">
              <div className="flex gap-4">
                <Image
                  src={
                    user?.avatar?.url ||
                    "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                  }
                  width={44}
                  height={44}
                  alt="Avatar"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5 shrink-0"
                />
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  placeholder="Ask a community question regarding this chapter..."
                  className="w-full text-sm md:text-base outline-none bg-slate-50 border border-slate-200 dark:border-white/10 dark:bg-slate-900 rounded-xl p-3 text-slate-800 dark:text-slate-100 focus:border-[#37a39a] dark:focus:border-[#37a39a] transition-all resize-none"
                />
              </div>
              <div className="w-full flex justify-end">
                <button
                  disabled={questionCreationLoading || question.trim() === ""}
                  className="px-5 py-2.5 text-xs md:text-sm font-semibold tracking-wide rounded-xl text-white bg-[#37a39a] hover:bg-[#2d877f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs shadow-[#37a39a]/10"
                  onClick={handleQuestion}
                >
                  {questionCreationLoading ? "Submitting..." : "Post Question"}
                </button>
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100 dark:bg-white/5" />

            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        )}

        {/* REVIEWS PANEL */}
        {activeBar === 3 && (
          <div className="space-y-6">
            {!isReviewExists && (
              <div className="p-5 bg-white dark:bg-[#0b0c14]/40 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xs space-y-4">
                <div className="flex gap-4">
                  <Image
                    src={
                      user?.avatar?.url ||
                      "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={44}
                    height={44}
                    alt="Reviewer avatar"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5 shrink-0"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Share your student rating{" "}
                        <span className="text-red-500">*</span>
                      </h4>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) =>
                          rating >= i ? (
                            <AiFillStar
                              key={i}
                              className="cursor-pointer text-amber-400 transition-transform hover:scale-110"
                              size={22}
                              onClick={() => setRating(i)}
                            />
                          ) : (
                            <AiOutlineStar
                              key={i}
                              className="cursor-pointer text-slate-300 dark:text-slate-600 transition-transform hover:scale-110"
                              size={22}
                              onClick={() => setRating(i)}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                      placeholder="Write your constructive feedback here..."
                      className="w-full text-sm outline-none bg-slate-50 border border-slate-200 dark:border-white/10 dark:bg-slate-900 rounded-xl p-3 text-slate-800 dark:text-slate-100 focus:border-[#37a39a] dark:focus:border-[#37a39a] transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="w-full flex justify-end">
                  <button
                    disabled={reviewCreationLoading || review.trim() === ""}
                    className="px-5 py-2.5 text-xs md:text-sm font-semibold tracking-wide rounded-xl text-white bg-[#37a39a] hover:bg-[#2d877f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    onClick={handleReviewSubmit}
                  >
                    {reviewCreationLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            )}

            <div className="w-full h-[1px] bg-slate-100 dark:bg-white/5" />

            {/* REVIEWS LIST TIMELINE */}
            <div className="space-y-4">
              {(course?.reviews && [...course.reviews].reverse())?.map(
                (item: any, index: number) => {
                  const isCurrentReviewReplyActive =
                    isReviewReply && reviewId === item._id;

                  return (
                    <div
                      className="p-5 bg-white border border-slate-200/50 dark:border-white/5 dark:bg-[#0b0c14]/40 rounded-2xl shadow-xs space-y-4"
                      key={index}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Image
                            src={
                              item.user?.avatar?.url ||
                              "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={44}
                            height={44}
                            alt="Avatar"
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#37a39a]/10"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {item?.user?.name}
                            </h4>
                            <div className="scale-75 origin-left mt-0.5">
                              <Ratings rating={item.rating} />
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          {format(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 sm:pl-14 leading-relaxed">
                        {item.comment}
                      </p>

                      {/* ADMIN RESPONSE CTA */}
                      {user?.role === "admin" && (
                        <div className="sm:pl-14">
                          <button
                            className="text-xs font-semibold text-[#37a39a] hover:underline cursor-pointer"
                            onClick={() => {
                              setIsReviewReply(
                                !isReviewReply || reviewId !== item._id,
                              );
                              setReviewId(item._id);
                            }}
                          >
                            {isCurrentReviewReplyActive
                              ? "↳ Cancel Reply"
                              : "↳ Write Staff Reply"}
                          </button>
                        </div>
                      )}

                      {/* ADMIN REPLY BOX FORM */}
                      {isCurrentReviewReplyActive && (
                        <div className="sm:pl-14 flex items-center gap-2 relative mt-2">
                          <input
                            type="text"
                            placeholder="Enter your administrative response..."
                            value={reply}
                            onChange={(e: any) => setReply(e.target.value)}
                            className="w-full text-xs md:text-sm outline-none bg-slate-50 border border-slate-200 dark:border-white/10 dark:bg-slate-900 rounded-xl p-2.5 pr-20 text-slate-800 dark:text-slate-100 focus:border-[#37a39a]"
                          />
                          <button
                            type="submit"
                            disabled={
                              reply.trim() === "" || replyCreationLoading
                            }
                            className="absolute right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                            onClick={handleReviewReplySubmit}
                          >
                            {replyCreationLoading ? "Sending..." : "Send"}
                          </button>
                        </div>
                      )}

                      {/* REVIEWS INLINE STAFF REPLIES */}
                      {item.commentReplies?.map(
                        (replyItem: any, replyIndex: number) => (
                          <div
                            className="ml-4 sm:ml-14 p-4 rounded-xl bg-slate-50 dark:bg-white/5 flex gap-3 border border-slate-100 dark:border-transparent"
                            key={replyIndex}
                          >
                            <Image
                              src={
                                replyItem.user?.avatar?.url ||
                                "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                              }
                              width={36}
                              height={36}
                              alt="Staff avatar"
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/10"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {replyItem.user?.name}
                                </h5>
                                <VscVerifiedFilled className="text-blue-500 text-sm" />
                                <span className="text-[9px] bg-blue-500/15 text-blue-500 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                                  Staff
                                </span>
                              </div>

                              {/* FIXED: Changed from replyItem.question to replyItem.comment */}
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {replyItem.comment}
                              </p>

                              <span className="block text-[10px] text-slate-400 pt-1">
                                {format(replyItem.createdAt)}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* COMPONENT: COMMENT REPLY LIST WRAPPER */
const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <div className="w-full space-y-4">
      {data[activeVideo]?.question?.map((item: any, index: any) => (
        <CommentItem
          key={index}
          data={data}
          activeVideo={activeVideo}
          item={item}
          index={index}
          answer={answer}
          setAnswer={setAnswer}
          questionId={questionId}
          setQuestionId={setQuestionId}
          handleAnswerSubmit={handleAnswerSubmit}
          answerCreationLoading={answerCreationLoading}
        />
      ))}
    </div>
  );
};

/* COMPONENT: INDIVIDUAL QUESTION THREAD ITEM */
const CommentItem = ({
  questionId,
  setQuestionId,
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setreplyActive] = useState(false);
  return (
    <div className="p-5 bg-white border border-slate-200/50 dark:border-white/5 dark:bg-[#0b0c14]/40 rounded-2xl shadow-xs space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Image
            src={
              item.user.avatar?.url ||
              "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
            }
            width={44}
            height={44}
            alt="User Avatar"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#37a39a]/10"
          />
          <div className="space-y-1">
            <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
              {item?.user.name}
            </h5>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {item.createdAt ? format(item.createdAt) : ""}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed sm:pl-14">
        {item?.question}
      </p>

      <div className="w-full flex items-center gap-4 sm:pl-14 pt-1">
        <button
          className="text-xs font-semibold text-[#37a39a] hover:underline cursor-pointer flex items-center gap-1"
          onClick={() => {
            setreplyActive(!replyActive);
            setQuestionId(item._id);
          }}
        >
          {!replyActive
            ? item.questionReplies?.length !== 0
              ? `View Replies (${item.questionReplies.length})`
              : "Reply"
            : "Hide Replies"}
        </button>
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <BiMessage size={16} />
          <span className="text-xs font-medium">
            {item.questionReplies?.length || 0}
          </span>
        </div>
      </div>

      {/* REPLIES INLINE LAYOUT OPEN COMPONENT */}
      {replyActive && questionId === item._id && (
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/5 mt-2">
          {item.questionReplies?.map((replyItem: any, index: number) => (
            <div
              className="sm:ml-14 p-4 rounded-xl bg-slate-50 dark:bg-white/5 flex gap-3 border border-slate-100 dark:border-transparent"
              key={replyItem._id || index}
            >
              <Image
                src={
                  replyItem.user.avatar?.url ||
                  "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                }
                width={36}
                height={36}
                alt="Respondent Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {replyItem.user.name}
                  </h5>
                  {replyItem.user.role === "admin" && (
                    <div className="flex items-center gap-0.5 text-blue-500">
                      <VscVerifiedFilled size={14} />
                      <span className="text-[9px] bg-blue-500/15 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                        Staff
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {replyItem.answer}
                </p>
                <span className="block text-[10px] text-slate-400 pt-0.5">
                  {format(replyItem.createdAt)}
                </span>
              </div>
            </div>
          ))}

          {/* ADD INLINE REPLY FORM DRAWER */}
          <div className="sm:ml-14 flex items-center gap-2 relative mt-3 pt-2">
            <input
              type="text"
              placeholder="Write your response to this thread..."
              value={answer}
              onChange={(e: any) => setAnswer(e.target.value)}
              className="w-full text-xs md:text-sm outline-none bg-slate-50 border border-slate-200 dark:border-white/10 dark:bg-slate-900 rounded-xl p-2.5 pr-20 text-slate-800 dark:text-slate-100 focus:border-[#37a39a]"
            />
            <button
              type="submit"
              disabled={answer.trim() === "" || answerCreationLoading}
              className="absolute right-2 px-3 py-1 bg-[#37a39a] hover:bg-[#2d877f] disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              onClick={handleAnswerSubmit}
            >
              {answerCreationLoading ? "Sending..." : "Reply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContentMedia;
