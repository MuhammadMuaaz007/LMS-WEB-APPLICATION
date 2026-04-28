import express, { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service.js";
import CourseModel from "../models/course.model.js";
import { redis } from "../utils/redis.js";

// upload course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// edit course

export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get single course
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id as string;
      const isCourseExist = await redis.get(courseId);
      if (isCourseExist) {
        const course = JSON.parse(isCourseExist);
        return res.status(200).json({
          success: true,
          course,
        });
      }
      const course = await CourseModel.findById(req.params.id).select(
        "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links",
      );
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      await redis.set(courseId, JSON.stringify(course));
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get all courses without purchasing

export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCoursesExist = await redis.get("allCourses");
      if (isCoursesExist) {
        const courses = JSON.parse(isCoursesExist);
        return res.status(200).json({
          success: true,
          courses,
        });
      }
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
      );
      await redis.set("allCourses", JSON.stringify(courses));
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
