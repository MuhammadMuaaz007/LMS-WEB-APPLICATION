import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import OrderModel from "../models/order.model.js";
// create new order service
export const newOrder = CatchAsyncError(async (data, res, next) => {
    const order = await OrderModel.create(data);
    res.status(200).json({
        success: true,
        order,
    });
});
export const getAllOrdersService = async (res) => {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        orders,
    });
};
