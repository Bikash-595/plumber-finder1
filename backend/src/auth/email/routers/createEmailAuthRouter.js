import { Router } from "express";
import { createEmailAuthController } from "../controllers/createEmailAuthController.js";
import { validateEmailLogin, validateEmailSignup } from "../middleware/validateEmailAuth.js";

/** POST /signup and POST /login for one account type (mounted under /api/auth/<type>). */
export function createEmailAuthRouter(account) {
  const controller = createEmailAuthController(account);
  const router = Router();
  // Account types can add their own signup checks (customers: a real ZIP code).
  router.post("/signup", validateEmailSignup(account), ...(account.signupMiddleware ?? []), controller.signup);
  router.post("/login", validateEmailLogin, controller.login);
  return router;
}
