import express from "express";
import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller.js";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-user-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getUserAnalytics,
);

analyticsRouter.get(
  "/get-order-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getOrderAnalytics,
);

analyticsRouter.get(
  "/get-course-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getCourseAnalytics,
);

export default analyticsRouter;
