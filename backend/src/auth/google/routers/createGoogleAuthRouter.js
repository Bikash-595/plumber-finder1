import { Router } from "express";
import { createGoogleAuthController } from "../controllers/createGoogleAuthController.js";
import { validateGoogleAuth } from "../middleware/validateGoogleAuth.js";

/** POST /google for one account type (mounted under /api/auth/<type>). */
export function createGoogleAuthRouter(account) {
  const controller = createGoogleAuthController(account);
  const router = Router();
  router.post("/google", validateGoogleAuth, controller.google);
  return router;
}
