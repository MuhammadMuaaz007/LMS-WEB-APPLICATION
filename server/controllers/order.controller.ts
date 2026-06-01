import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Order from "../models/order.model.js";
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import { getAllOrdersService, newOrder } from "../services/order.service.js";
import sendMailer from "../utils/sendmail.js";
import NotificationModel from "../models/notification.model.js";

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
        payment_info,
      };
      const mailData = {
        order: {
          _id: courseId.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      try {
        if (user) {
          await sendMailer({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
      // add course to user's courses
      user?.courses.push(courseId);
      await NotificationModel.create({
        userId: user?._id.toString(),
        title: "New Order",
        message: `You have successfully purchased the course ${course.name}`,
      });
      // increment the purchased count of the course
      course.purchased = (course.purchased || 0) + 1;
      // save the user and course
      await user?.save();
      await course?.save();
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get all orders -- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
