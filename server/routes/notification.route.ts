import express from "express";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";
import { getNotifications } from "../controllers/notification.controller.js";

const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRole("admin"),
  getNotifications,
);

export default notificationRoute;
