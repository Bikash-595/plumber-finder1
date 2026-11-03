import { Router } from "express";
import { verificationController } from "../controllers/verificationController.js";
import { requireVerificationAccess } from "../middleware/verificationAuth.js";
import { validateVerification } from "../middleware/validateVerification.js";

// Mounted at /api/freelancers/verification. Private: no public route (admins read it via the admin API).
export const verificationRouter = Router();
verificationRouter.get("/", requireVerificationAccess, verificationController.getMine);
verificationRouter.put("/", requireVerificationAccess, validateVerification, verificationController.saveMine);
verificationRouter.delete("/", requireVerificationAccess, verificationController.deleteMine);
