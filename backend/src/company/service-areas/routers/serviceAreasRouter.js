import { Router } from "express";
import { serviceAreasController } from "../controllers/serviceAreasController.js";
import { requireCompanyServiceAreasAccess } from "../middleware/serviceAreasAuth.js";
import { validateServiceAreas } from "../middleware/validateServiceAreas.js";

export const serviceAreasRouter = Router();

// Public: shown on a published company profile (by public listing id).
serviceAreasRouter.get("/public/:listingId", serviceAreasController.getPublic);

// Signed-in company: read and save its own service areas.
serviceAreasRouter.get("/", requireCompanyServiceAreasAccess, serviceAreasController.getMine);
serviceAreasRouter.put("/", requireCompanyServiceAreasAccess, validateServiceAreas, serviceAreasController.saveMine);
serviceAreasRouter.post("/", requireCompanyServiceAreasAccess, validateServiceAreas, serviceAreasController.saveMine);
serviceAreasRouter.delete("/", requireCompanyServiceAreasAccess, serviceAreasController.deleteMine);
