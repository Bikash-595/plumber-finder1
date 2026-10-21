import { Router } from "express";
import { createAppleAuthRouter } from "../../apple/routers/createAppleAuthRouter.js";
import { createEmailAuthRouter } from "../../email/routers/createEmailAuthRouter.js";
import { createGoogleAuthRouter } from "../../google/routers/createGoogleAuthRouter.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { userAccount, userAuthController } from "../controllers/userAuthController.js";

// Mounted at /api/auth/users.
export const userAuthRouter = Router();
userAuthRouter.use(createEmailAuthRouter(userAccount)); // POST /signup, POST /login
userAuthRouter.use(createGoogleAuthRouter(userAccount)); // POST /google
userAuthRouter.use(createAppleAuthRouter(userAccount)); // POST /apple
userAuthRouter.get("/me", requireAuth(userAccount.accountType), userAuthController.me);
