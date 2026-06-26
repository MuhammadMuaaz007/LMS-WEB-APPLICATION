import express from "express";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller.js";
import { updateAccessToken } from "../controllers/user.controller.js";

const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getNotifications,
);

notificationRoute.put(
  "/update-notification-status/:id",
  updateAccessToken,
  isAuthenticated,
  updateNotificationStatus,
);

export default notificationRoute;
