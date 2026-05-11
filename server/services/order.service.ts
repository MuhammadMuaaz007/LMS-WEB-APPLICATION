import { NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import OrderModel from "../models/order.model.js";
import { Response } from "express";

// create new order service
export const newOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
    res.status(200).json({
      success: true,
      order,
    });
  },
);
