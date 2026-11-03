import { Router } from "express";
import { locationController } from "../controllers/locationController.js";
import { requireCompanyLocationAccess } from "../middleware/locationAuth.js";
import { validateLocation } from "../middleware/validateLocation.js";

export const locationRouter = Router();

// Signed-in company: its address, coordinates and travel radius (the profile map and directory cards use them).
locationRouter.get("/", requireCompanyLocationAccess, locationController.getMine);
locationRouter.put("/", requireCompanyLocationAccess, validateLocation, locationController.saveMine);
locationRouter.delete("/", requireCompanyLocationAccess, locationController.deleteMine);
