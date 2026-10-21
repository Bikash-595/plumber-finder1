import { Router } from "express";
import { securityController } from "../controllers/securityController.js";
import { requireSecurityAccess } from "../middleware/securityAuth.js";
import { validatePasswordChange } from "../middleware/validatePasswordChange.js";

// Mounted at /api/users/security.
export const securityRouter = Router();
securityRouter.use(requireSecurityAccess);
securityRouter.get("/", securityController.status);
securityRouter.post("/password", validatePasswordChange, securityController.changePassword);
