import { Router } from "express";
import { locationController } from "../controllers/locationController.js";
import { requireLocationAccess } from "../middleware/locationAuth.js";
import { validateLocation } from "../middleware/validateLocation.js";

// Mounted at /api/freelancers/location.
export const locationRouter = Router();
locationRouter.get("/", requireLocationAccess, locationController.getMine);
locationRouter.put("/", requireLocationAccess, validateLocation, locationController.saveMine);
locationRouter.delete("/", requireLocationAccess, locationController.deleteMine);
