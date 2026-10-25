import { Router } from "express";
import { openingHoursController } from "../controllers/openingHoursController.js";
import { requireCompanyOpeningHoursAccess } from "../middleware/openingHoursAuth.js";
import { validateOpeningHours } from "../middleware/validateOpeningHours.js";

export const openingHoursRouter = Router();

// Public: shown on a published company profile (by public listing id).
openingHoursRouter.get("/public/:listingId", openingHoursController.getPublic);

// Signed-in company: read, save, and delete its own opening hours.
openingHoursRouter.get("/", requireCompanyOpeningHoursAccess, openingHoursController.getMine);
openingHoursRouter.put("/", requireCompanyOpeningHoursAccess, validateOpeningHours, openingHoursController.saveMine);
openingHoursRouter.post("/", requireCompanyOpeningHoursAccess, validateOpeningHours, openingHoursController.saveMine);
openingHoursRouter.delete("/", requireCompanyOpeningHoursAccess, openingHoursController.deleteMine);
