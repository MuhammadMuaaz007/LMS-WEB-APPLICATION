import express from "express";

const layoutRouter = express.Router();

import { createLayout } from "../controllers/layout.controller.js";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizeRole("admin"),
  createLayout,
);

export default layoutRouter;
