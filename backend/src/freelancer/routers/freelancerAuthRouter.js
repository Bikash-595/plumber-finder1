import { Router } from "express";
import { requireAuth } from "../../config/authMiddleware.js";
import { freelancerAuthConfig } from "../config/authConfig.js";
import { freelancerAuthController } from "../controllers/freelancerAuthController.js";

export const freelancerAuthRouter = Router();
freelancerAuthRouter.post("/signup", freelancerAuthController.signup);
freelancerAuthRouter.post("/login", freelancerAuthController.login);
freelancerAuthRouter.post("/google", freelancerAuthController.google);
freelancerAuthRouter.get("/me", requireAuth(freelancerAuthConfig.accountType), freelancerAuthController.me);
