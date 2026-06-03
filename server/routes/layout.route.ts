import express from "express";

const layoutRouter = express.Router();

import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller.js";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizeRole("admin"),
  createLayout,
);

layoutRouter.put(
  "/edit-layout",
  isAuthenticated,
  authorizeRole("admin"),
  editLayout,
);

layoutRouter.get("/get-layout", getLayoutByType);

export default layoutRouter;
