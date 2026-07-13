import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import userModel from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import CourseModel from "../models/course.model.js";
import { generateLast12MonthData } from "../utils/analytics.generator.js";
export const getUserAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await generateLast12MonthData(userModel);
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const getOrderAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const orders = await generateLast12MonthData(orderModel);
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const getCourseAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const courses = await generateLast12MonthData(CourseModel);
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
