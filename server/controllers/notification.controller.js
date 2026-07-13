import NotificationModel from "../models/notification.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import notificationModel from "../models/notification.model.js";
import cron from "node-cron";
// get all notification -- only for the admin
// not for the user because the user will get only its notification not all notification from the database
export const getNotifications = CatchAsyncError(async (req, res, next) => {
    try {
        const notifications = await NotificationModel.find({}).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// update the status of the notification
export const updateNotificationStatus = CatchAsyncError(async (req, res, next) => {
    try {
        const notification = await notificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler("Notification not found", 400));
        }
        else {
            await notificationModel.findByIdAndUpdate(req.params.id, {
                status: "read",
            });
        }
        const notifications = await notificationModel
            .find()
            .sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});
// delete the notifications automatically
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
    console.log("Deleted read notifications older than 30 days");
});
