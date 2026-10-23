import { Router } from "express";
import { openingHoursController } from "../controllers/openingHoursController.js";
import { requireFreelancerOpeningHoursAccess } from "../middleware/openingHoursAuth.js";
import { validateOpeningHours } from "../middleware/validateOpeningHours.js";

export const openingHoursRouter = Router();

// Public: shown on a published freelancer profile (by public listing id).
openingHoursRouter.get("/public/:listingId", openingHoursController.getPublic);

// Signed-in freelancer: read and save its own opening hours.
openingHoursRouter.get("/", requireFreelancerOpeningHoursAccess, openingHoursController.getMine);
openingHoursRouter.put("/", requireFreelancerOpeningHoursAccess, validateOpeningHours, openingHoursController.saveMine);
openingHoursRouter.post("/", requireFreelancerOpeningHoursAccess, validateOpeningHours, openingHoursController.saveMine);
openingHoursRouter.delete("/", requireFreelancerOpeningHoursAccess, openingHoursController.deleteMine);
