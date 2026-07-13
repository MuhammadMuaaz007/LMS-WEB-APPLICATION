import express from "express";
const layoutRouter = express.Router();
import { createLayout, editLayout, getLayoutByType, } from "../controllers/layout.controller.js";
import { authorizeRole, isAuthenticated } from "../middleware/auth.js";
import { updateAccessToken } from "../controllers/user.controller.js";
layoutRouter.post("/create-layout", updateAccessToken, isAuthenticated, authorizeRole("admin"), createLayout);
layoutRouter.put("/edit-layout", updateAccessToken, isAuthenticated, authorizeRole("admin"), editLayout);
layoutRouter.post("/get-layout", getLayoutByType);
export default layoutRouter;
