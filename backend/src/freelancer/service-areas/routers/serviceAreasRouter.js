import { Router } from "express";
import { serviceAreasController } from "../controllers/serviceAreasController.js";
import { requireFreelancerServiceAreasAccess } from "../middleware/serviceAreasAuth.js";
import { validateServiceAreas } from "../middleware/validateServiceAreas.js";

export const serviceAreasRouter = Router();

// Public: shown on a published freelancer profile (by public listing id).
serviceAreasRouter.get("/public/:listingId", serviceAreasController.getPublic);

// Signed-in freelancer: read and save its own service areas.
serviceAreasRouter.get("/", requireFreelancerServiceAreasAccess, serviceAreasController.getMine);
serviceAreasRouter.put("/", requireFreelancerServiceAreasAccess, validateServiceAreas, serviceAreasController.saveMine);
serviceAreasRouter.post("/", requireFreelancerServiceAreasAccess, validateServiceAreas, serviceAreasController.saveMine);
