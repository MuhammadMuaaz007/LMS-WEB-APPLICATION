import CourseModel from "../models/course.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
// create course service
export const createCourse = CatchAsyncError(async (data, res) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course,
    });
});
// get all courses service
export const getAllCoursesService = async (res) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        courses,
    });
};
