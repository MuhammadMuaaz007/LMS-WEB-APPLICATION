import NotificationModel from "../models/notification.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Request, Response, NextFunction } from "express";

// get all notification -- only for the admin
// not for the user because the user will get only its notification not all notification from the database
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find({
        userId: req.user?._id,
      }).sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);


