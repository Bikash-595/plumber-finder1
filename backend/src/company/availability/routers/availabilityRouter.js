import { useSide } from "../../../shared/business/sides.js";
import { Router } from "express";
import { availabilityController } from "../controllers/availabilityController.js";
import { requireAvailabilityAccess } from "../middleware/availabilityAuth.js";
import { validateAvailability } from "../middleware/validateAvailability.js";

// Mounted at /api/companies/availability.
export const companyAvailabilityRouter = Router();
companyAvailabilityRouter.get("/public/:listingId", useSide("company"), availabilityController.getPublic);
companyAvailabilityRouter.get("/", requireAvailabilityAccess, availabilityController.get);
companyAvailabilityRouter.put("/", requireAvailabilityAccess, validateAvailability, availabilityController.save);
