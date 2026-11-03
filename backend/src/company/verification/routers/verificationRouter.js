import { Router } from "express";
import { verificationController } from "../controllers/verificationController.js";
import { requireCompanyVerificationAccess } from "../middleware/verificationAuth.js";
import { validateVerification } from "../middleware/validateVerification.js";

export const verificationRouter = Router();

// Private: no public route. Only the company itself (and admins, through the admin API) can read these.
verificationRouter.get("/", requireCompanyVerificationAccess, verificationController.getMine);
verificationRouter.put("/", requireCompanyVerificationAccess, validateVerification, verificationController.saveMine);
verificationRouter.delete("/", requireCompanyVerificationAccess, verificationController.deleteMine);
