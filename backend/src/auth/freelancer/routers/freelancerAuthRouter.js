import { Router } from "express";
import { createAppleAuthRouter } from "../../apple/routers/createAppleAuthRouter.js";
import { createEmailAuthRouter } from "../../email/routers/createEmailAuthRouter.js";
import { createGoogleAuthRouter } from "../../google/routers/createGoogleAuthRouter.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { freelancerAccount, freelancerAuthController } from "../controllers/freelancerAuthController.js";

// Mounted at /api/auth/freelancers.
export const freelancerAuthRouter = Router();
freelancerAuthRouter.use(createEmailAuthRouter(freelancerAccount)); // POST /signup, POST /login
freelancerAuthRouter.use(createGoogleAuthRouter(freelancerAccount)); // POST /google
freelancerAuthRouter.use(createAppleAuthRouter(freelancerAccount)); // POST /apple
freelancerAuthRouter.get("/me", requireAuth(freelancerAccount.accountType), freelancerAuthController.me);
