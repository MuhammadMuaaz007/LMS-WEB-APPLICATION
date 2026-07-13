import mongoose, { Schema } from "mongoose";
// Schemas
const linkSchema = new Schema({
    title: String,
    url: String,
});
const commentSchema = new Schema({
    user: Object,
    question: String,
    questionReplies: [Object],
}, { timestamps: true });
const reviewSchema = new Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object],
}, { timestamps: true });
const courseDataSchema = new Schema({
    title: String,
    description: String,
    videoUrl: String,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    question: [commentSchema],
});
const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            //require: true,
            type: String,
        },
        url: {
            //require: true,
            type: String,
        },
    },
    tags: {
        required: true,
        type: String,
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: {
        type: [{ title: String }],
    },
    prerequisites: {
        type: [{ title: String }],
    },
    courseData: [courseDataSchema],
    rating: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
    reviews: [reviewSchema],
}, { timestamps: true });
const CourseModel = mongoose.model("course", courseSchema);
export default CourseModel;
