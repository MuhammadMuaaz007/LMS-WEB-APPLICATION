import express from "express";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";
import { uploadCourse, editCourse } from "../controllers/course.controller.js";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRole("admin"),
  uploadCourse,
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRole("admin"),
  editCourse,
);

export default courseRouter;
