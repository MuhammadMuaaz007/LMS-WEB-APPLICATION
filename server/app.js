import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ErrorMiddleware from "./middleware/error.js";
import courseRouter from "./routes/course.route.js";
import orderRouter from "./routes/order.route.js";
import notificationRoute from "./routes/notification.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import layoutRouter from "./routes/layout.route.js";
dotenv.config();
export const app = express();
// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRoute, analyticsRouter, layoutRouter);
app.all(/.*/, (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
app.use(ErrorMiddleware);
