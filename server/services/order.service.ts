import { NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import OrderModel from "../models/order.model.js";

// create new order
export const newOrder = CatchAsyncError(
  async (data: any, next: NextFunction) => {
    const order = await OrderModel.create(data);
    next(order);
  },
);
