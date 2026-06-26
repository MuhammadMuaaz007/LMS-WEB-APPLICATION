import express from "express";
import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller.js";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";
import { updateAccessToken } from "../controllers/user.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-user-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getUserAnalytics,
);

analyticsRouter.get(
  "/get-order-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getOrderAnalytics,
);

analyticsRouter.get(
  "/get-course-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getCourseAnalytics,
);

export default analyticsRouter;
