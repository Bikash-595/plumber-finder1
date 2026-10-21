import { Router } from "express";
import { createAppleAuthRouter } from "../../apple/routers/createAppleAuthRouter.js";
import { createEmailAuthRouter } from "../../email/routers/createEmailAuthRouter.js";
import { createGoogleAuthRouter } from "../../google/routers/createGoogleAuthRouter.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { companyAccount, companyAuthController } from "../controllers/companyAuthController.js";

// Mounted at /api/auth/companies.
export const companyAuthRouter = Router();
companyAuthRouter.use(createEmailAuthRouter(companyAccount)); // POST /signup, POST /login
companyAuthRouter.use(createGoogleAuthRouter(companyAccount)); // POST /google
companyAuthRouter.use(createAppleAuthRouter(companyAccount)); // POST /apple
companyAuthRouter.get("/me", requireAuth(companyAccount.accountType), companyAuthController.me);
