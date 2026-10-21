import { Router } from "express";
import { profileController } from "../controllers/profileController.js";
import { requireProfileAccess } from "../middleware/profileAuth.js";
import { validateProfile } from "../middleware/validateProfile.js";

// Mounted at /api/users/profile.
export const profileRouter = Router();
profileRouter.use(requireProfileAccess);
profileRouter.get("/", profileController.get);
profileRouter.put("/", validateProfile, profileController.update);
