import mongoose, { Schema } from "mongoose";
const faqSchema = new Schema({
    question: { type: String },
    answer: { type: String },
});
const CategorySchema = new Schema({
    title: { type: String },
});
const BannerImageSchema = new Schema({
    public_id: { type: String },
    url: { type: String },
});
const LayoutSchema = new Schema({
    type: { type: String },
    faq: [faqSchema],
    categories: [CategorySchema],
    banner: {
        image: BannerImageSchema,
        title: { type: String },
        subTitle: { type: String },
    },
});
const LayoutModel = mongoose.model("Layout", LayoutSchema);
export default LayoutModel;
