import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { decode } from "node:punycode";
import { redis } from "../utils/redis.js";
dotenv.config();

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return next(
        new ErrorHandler("Please login to access this resource", 400),
      );
    }
    const decoded = Jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN as string,
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Invalid access token", 400));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource", 404),
      );
    }
    req.user = JSON.parse(user);
    next();
  },
);

//validate user role

export const authorizeRole = (...role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!role.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role : ${req.user?.role} is not allowed to access this resourse`,
          403,
        ),
      );
    }
    next();
  };
};
