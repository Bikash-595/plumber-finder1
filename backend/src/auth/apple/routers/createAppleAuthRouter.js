import { Router } from "express";
import { createAppleAuthController } from "../controllers/createAppleAuthController.js";
import { validateAppleAuth } from "../middleware/validateAppleAuth.js";

/** POST /apple for one account type (mounted under /api/auth/<type>). */
export function createAppleAuthRouter(account) {
  const controller = createAppleAuthController(account);
  const router = Router();
  router.post("/apple", validateAppleAuth, controller.apple);
  return router;
}
