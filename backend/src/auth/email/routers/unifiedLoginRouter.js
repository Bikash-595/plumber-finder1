import { Router } from "express";
import { unifiedLogin } from "../controllers/unifiedLoginController.js";
import { loginRateLimit } from "../../shared/middleware/loginRateLimit.js";
import { validateEmailLogin } from "../middleware/validateEmailAuth.js";

// Mounted at /api/auth: POST /api/auth/login (any account type).
export const unifiedLoginRouter = Router();
unifiedLoginRouter.post("/login", loginRateLimit, validateEmailLogin, unifiedLogin);
