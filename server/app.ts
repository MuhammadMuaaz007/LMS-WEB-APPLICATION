import dotenv from "dotenv";
import express from "express";  
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ErrorMiddleware from "./middleware/error.js";

dotenv.config();
export const app = express();
// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());
// cors => cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use("/api/v1", userRouter);
// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});
// unknown route
app.all(/.*/,(req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
