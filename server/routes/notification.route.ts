import express from "express";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller.js";

const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRole("admin"),
  getNotifications,
);

notificationRoute.put(
  "/update-notification-status/:id",
  isAuthenticated,
  updateNotificationStatus,
);

export default notificationRoute;
