import { Response,NextFunction } from "express";
import CourseModel from "../models/course.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";

// create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response,next:NextFunction) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  },
);
