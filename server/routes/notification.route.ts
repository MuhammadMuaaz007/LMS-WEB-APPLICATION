import express from "express";
import { authorizeRole } from "../middleware/auth.js";
import { getNotifications } from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-notifications",
  authorizeRole("admin"),
  getNotifications,
);

export default notificationRouter;