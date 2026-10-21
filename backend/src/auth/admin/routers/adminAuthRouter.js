import { Router } from "express";
import { validateEmailLogin } from "../../email/middleware/validateEmailAuth.js";
import { adminAuthController } from "../controllers/adminAuthController.js";
import { adminLoginRateLimit } from "../middleware/adminLoginRateLimit.js";
import { requireActiveAdmin } from "../middleware/requireActiveAdmin.js";

// Mounted at /api/auth/admins. Login and "me" only — no signup, Google, or Apple for admins.
export const adminAuthRouter = Router();
adminAuthRouter.post("/login", adminLoginRateLimit, validateEmailLogin, adminAuthController.login);
adminAuthRouter.get("/me", requireActiveAdmin, adminAuthController.me);
