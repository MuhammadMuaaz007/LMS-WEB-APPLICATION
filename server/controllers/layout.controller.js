import ErrorHandler from "../utils/ErrorHandler.js";
import LayoutModel from "../models/layout.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import Cloudinary from "cloudinary";
export const createLayout = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isLayoutExist = await LayoutModel.findOne({ type });
        if (isLayoutExist) {
            return next(new ErrorHandler(`Layout of this type ${type} already exists`, 400));
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
        }
        else if (type == "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }
        else if (type == "Categories") {
            const { categories } = req.body;
            const categoryItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            await LayoutModel.create({
                type: "Categories",
                categories: categoryItems,
            });
        }
        res.status(201).json({
            success: true,
            message: "Layout created successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const editLayout = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const bannerData = await LayoutModel.findOne({ type: "Banner" });
            if (bannerData) {
                await Cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
            }
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
            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
        }
        else if (type === "FAQ") {
            const { faq } = req.body;
            const faqData = await LayoutModel.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await LayoutModel.findByIdAndUpdate(faqData?._id, {
                type: "FAQ",
                faq: faqItems,
            });
        }
        else if (type === "Categories") {
            const { categories } = req.body;
            const CategoriesData = await LayoutModel.findOne({
                type: "Categories",
            });
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            await LayoutModel.findByIdAndUpdate(CategoriesData._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout edit Successfully",
        });
    }
    catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});
export const getLayoutByType = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.body;
        const layout = await LayoutModel.findOne({ type });
        res.status(200).json({
            success: true,
            layout,
        });
    }
    catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});
