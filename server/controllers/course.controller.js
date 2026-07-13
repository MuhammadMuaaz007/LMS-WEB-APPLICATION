import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService, } from "../services/course.service.js";
import CourseModel from "../models/course.model.js";
import { redis } from "../utils/redis.js";
import mongoose from "mongoose";
import sendMailer from "../utils/sendmail.js";
import NotificationModel from "../models/notification.model.js";
import axios from "axios";
// Helper function to update redis with the exact stripped-down layout expected by getSingleCourse
const updateCourseCache = async (courseId) => {
    const cleanCourse = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links");
    if (cleanCourse) {
        await redis.set(courseId, JSON.stringify(cleanCourse), "EX", 604800); // 7 Days
    }
};
// upload course
export const uploadCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const data = req.body;
        // only upload if it's a STRING (base64 or url)
        if (data.thumbnail && typeof data.thumbnail === "string") {
            const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        createCourse(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// edit course
export const editCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const data = req.body;
        const courseId = req.params.id;
        const existingCourse = await CourseModel.findById(courseId);
        if (!existingCourse) {
            return next(new ErrorHandler("Course not found", 404));
        }
        // update thumbnail only if string (new image)
        if (data.thumbnail && typeof data.thumbnail === "string") {
            // safely delete old image
            const oldPublicId = existingCourse.thumbnail?.public_id;
            if (oldPublicId) {
                await cloudinary.v2.uploader.destroy(oldPublicId);
            }
            // upload new image
            const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const course = await CourseModel.findByIdAndUpdate(courseId, data, {
            new: true,
            runValidators: true,
        });
        // 🔥 UPDATED: Sync changes to Redis Cache
        await updateCourseCache(courseId.toString());
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// get single course
export const getSingleCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCourseExist = await redis.get(courseId);
        if (isCourseExist) {
            const course = JSON.parse(isCourseExist);
            return res.status(200).json({
                success: true,
                course,
            });
        }
        const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links");
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const getAllCourses = CatchAsyncError(async (req, res, next) => {
    try {
        const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// get course by the user
export const getCourseByUser = CatchAsyncError(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userCourseList = req.user?.courses;
        const courseExist = userCourseList?.find((course) => course._id.toString() === courseId);
        if (!courseExist) {
            return next(new ErrorHandler("You are not eligible to view this course", 404));
        }
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found in the database", 404));
        }
        const content = course?.courseData;
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const addQuestion = CatchAsyncError(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content Id", 400));
        }
        const content = course?.courseData.find((item) => {
            return item._id.equals(contentId);
        });
        if (!content) {
            return next(new ErrorHandler("Invalid content Id", 400));
        }
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        content.question.push(newQuestion);
        await NotificationModel.create({
            userId: req.user?._id.toString(),
            title: "New Question Received",
            message: `You have a new question in the course ${content?.title}`,
        });
        await course?.save();
        // 🔥 UPDATED: Sync structural upgrades down to Redis Cache
        await updateCourseCache(courseId.toString());
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const addAnswer = CatchAsyncError(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }
        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        }
        const question = courseContent?.question?.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler("Invalid question id", 400));
        }
        // create a new answer object
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        // add this answer to our course content
        question.questionReplies?.push(newAnswer);
        await course?.save();
        // 🔥 UPDATED: Sync fresh responses to Redis Cache
        await updateCourseCache(courseId.toString());
        if (req.user?._id === question.user._id) {
            await NotificationModel.create({
                userId: req.user?._id.toString(),
                title: "New Question Reply Received",
                message: `You have a new question reply in the course ${courseContent?.title}`,
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            try {
                await sendMailer({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const addReview = CatchAsyncError(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userCourseList = req.user?.courses;
        const isCourseExist = userCourseList?.find((course) => {
            return course._id.toString() === courseId;
        });
        if (!isCourseExist) {
            return next(new ErrorHandler("You are not eligible to access this course", 404));
        }
        const course = await CourseModel.findById(courseId);
        const { rating, review } = req.body;
        const newReview = {
            user: req.user,
            rating,
            comment: review,
        };
        course?.reviews.push(newReview);
        let sum = 0;
        course?.reviews.forEach((rev) => {
            sum = sum + rev.rating;
        });
        if (course) {
            course.rating = sum / course.reviews.length;
        }
        await NotificationModel.create({
            userId: req.user?._id.toString(),
            title: "New Review Received",
            message: `You have a new review in the course ${course?.name}`,
        });
        await course?.save();
        // 2. Clear out projections accurately in Redis
        await updateCourseCache(courseId.toString());
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (err) {
        return next(new ErrorHandler(err.message, 500));
    }
});
export const addReviewReply = CatchAsyncError(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        const review = course.reviews.find((rev) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }
        // create a review reply object
        const reviewReply = {
            comment,
            user: req.user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies?.push(reviewReply);
        await course?.save();
        // 🔥 UPDATED: Overwrite projection payload in Redis securely
        await updateCourseCache(courseId.toString());
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// get all courses -- only for admin
export const getAllCoursesAdmin = CatchAsyncError(async (req, res, next) => {
    try {
        getAllCoursesService(res);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
// delete course only for admin
export const deleteCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        if (course.thumbnail?.public_id) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
        }
        await course.deleteOne({ id });
        await redis.del(id.toString());
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
export const generateVideoUrl = CatchAsyncError(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        const playbackInfo = Buffer.from(JSON.stringify({ videoId: videoId })).toString("base64");
        res.json({
            otp: response.data.otp,
            playbackInfo: playbackInfo,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
