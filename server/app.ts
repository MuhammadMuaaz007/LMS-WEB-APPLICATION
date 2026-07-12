import dotenv from "dotenv";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ErrorMiddleware from "./middleware/error.js";
import courseRouter from "./routes/course.route.js";
import orderRouter from "./routes/order.route.js";
import notificationRoute from "./routes/notification.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import layoutRouter from "./routes/layout.route.js";
import { rateLimit } from "express-rate-limit";
dotenv.config();
export const app = express();
// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRoute,
  analyticsRouter,
  layoutRouter,
);

app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
app.use(limiter);

app.use(ErrorMiddleware);
