import { Router } from "express";
import { deleteHeaderProfile, headerProfileController } from "../controllers/headerProfileController.js";
import { requireFreelancerHeaderProfileAccess } from "../middleware/headerProfileAuth.js";
import { validateHeaderProfile } from "../middleware/validateHeaderProfile.js";

export const headerProfileRouter = Router();

// Public: shown on a published freelancer profile (by public listing id).
headerProfileRouter.get("/public/:listingId", headerProfileController.getPublic);

// Signed-in freelancer: read and save its own profile.
headerProfileRouter.get("/", requireFreelancerHeaderProfileAccess, headerProfileController.getMine);
headerProfileRouter.put("/", requireFreelancerHeaderProfileAccess, validateHeaderProfile, headerProfileController.saveMine);
headerProfileRouter.post("/", requireFreelancerHeaderProfileAccess, validateHeaderProfile, headerProfileController.saveMine);
headerProfileRouter.delete("/", requireFreelancerHeaderProfileAccess, deleteHeaderProfile);
