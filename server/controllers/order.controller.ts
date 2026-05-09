import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Order from "../models/order.model.js";
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import { newOrder } from "../services/order.service.js";

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body;
      const user = await userModel.findById(req.user?._id);
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId,
      );
      if (courseExistInUser) {
        return next(new ErrorHandler("Course already purchased", 400));
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: courseId,
        userId: user?._id,
      };
      newOrder(data, res, next);

      const mailData = {
        order: {
          _id: course._id.slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
