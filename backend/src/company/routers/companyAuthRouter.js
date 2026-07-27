import { Router } from "express";
import { requireAuth } from "../../config/authMiddleware.js";
import { companyAuthConfig } from "../config/authConfig.js";
import { companyAuthController } from "../controllers/companyAuthController.js";

export const companyAuthRouter = Router();
companyAuthRouter.post("/signup", companyAuthController.signup);
companyAuthRouter.post("/login", companyAuthController.login);
companyAuthRouter.post("/google", companyAuthController.google);
companyAuthRouter.get("/me", requireAuth(companyAuthConfig.accountType), companyAuthController.me);
