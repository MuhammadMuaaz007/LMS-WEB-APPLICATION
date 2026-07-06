import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Order from "../models/order.model.js";
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import { getAllOrdersService, newOrder } from "../services/order.service.js";
import sendMailer from "../utils/sendmail.js";
import NotificationModel from "../models/notification.model.js";
import "dotenv/config";
import Stripe from "stripe";
import { redis } from "../utils/redis.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body;

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;

          const paymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId);

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized", 400));
          }
        }
      }
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
      redis.set(req.user?._id, JSON.stringify(user), "EX", 3600);
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

export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  },
);

export const newPayments = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "SkillStack",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
