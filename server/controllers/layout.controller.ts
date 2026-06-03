import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import LayoutModel from "../models/layout.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import Cloudinary from "cloudinary";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isLayoutExist = await LayoutModel.findOne({ type });
      if (isLayoutExist) {
        return next(
          new ErrorHandler(`Layout of this type ${type} already exists`, 400),
        );
      }
      if (type == "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await Cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create({ type: "Banner", banner: banner });
      } else if (type == "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          }),
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      } else if (type == "Categories") {
        const { categories } = req.body;
        const categoryItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          }),
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoryItems,
        });
      }
      res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
