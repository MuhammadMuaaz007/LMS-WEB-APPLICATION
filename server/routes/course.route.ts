import express from "express";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";
import {
  uploadCourse,
  editCourse,
  getSingleCourse,
  getAllCourses,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReview,
  addReviewReply,
  getAllCoursesAdmin,
  deleteCourse,
  generateVideoUrl,
} from "../controllers/course.controller.js";
import { updateAccessToken } from "../controllers/user.controller.js";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  uploadCourse,
);
courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  editCourse,
);
//
courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

// with purchasing course, only for the user who purchased the course
courseRouter.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAuthenticated,
  getCourseByUser,
);

courseRouter.put(
  "/add-question",
  updateAccessToken,
  isAuthenticated,
  addQuestion,
);

courseRouter.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer);

courseRouter.put(
  "/add-review/:id",
  updateAccessToken,
  isAuthenticated,
  addReview,
);

courseRouter.put(
  "/add-reply",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  addReviewReply,
);

courseRouter.get(
  "/get-all-admin-courses",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getAllCoursesAdmin,
);

courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  deleteCourse,
);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

export default courseRouter;
