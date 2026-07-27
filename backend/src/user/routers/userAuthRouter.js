import { Router } from "express";
import { requireAuth } from "../../config/authMiddleware.js";
import { userAuthConfig } from "../config/authConfig.js";
import { userAuthController } from "../controllers/userAuthController.js";

export const userAuthRouter = Router();
userAuthRouter.post("/signup", userAuthController.signup);
userAuthRouter.post("/login", userAuthController.login);
userAuthRouter.post("/google", userAuthController.google);
userAuthRouter.get("/me", requireAuth(userAuthConfig.accountType), userAuthController.me);
