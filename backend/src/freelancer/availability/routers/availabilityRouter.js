import { Router } from "express";
import { availabilityController } from "../../../company/availability/controllers/availabilityController.js";
import { validateAvailability } from "../../../company/availability/middleware/validateAvailability.js";
import { useSide } from "../../../shared/business/sides.js";
import { requireAvailabilityAccess } from "../middleware/availabilityAuth.js";

// Mounted at /api/freelancers/availability. Booking requests are checked against these rules.
export const freelancerAvailabilityRouter = Router();
freelancerAvailabilityRouter.get("/public/:listingId", useSide("freelancer"), availabilityController.getPublic);
freelancerAvailabilityRouter.get("/", requireAvailabilityAccess, availabilityController.get);
freelancerAvailabilityRouter.put("/", requireAvailabilityAccess, validateAvailability, availabilityController.save);
