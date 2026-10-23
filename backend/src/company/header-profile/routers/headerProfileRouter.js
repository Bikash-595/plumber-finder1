import { Router } from "express";
import { headerProfileController } from "../controllers/headerProfileController.js";
import { requireCompanyHeaderProfileAccess } from "../middleware/headerProfileAuth.js";
import { validateHeaderProfile } from "../middleware/validateHeaderProfile.js";

export const headerProfileRouter = Router();

// Public: shown on a published company profile (by public listing id).
headerProfileRouter.get("/public/:listingId", headerProfileController.getPublic);

// Signed-in company: read and save its own header profile.
headerProfileRouter.get("/", requireCompanyHeaderProfileAccess, headerProfileController.getMine);
headerProfileRouter.put("/", requireCompanyHeaderProfileAccess, validateHeaderProfile, headerProfileController.saveMine);
headerProfileRouter.post("/", requireCompanyHeaderProfileAccess, validateHeaderProfile, headerProfileController.saveMine);
headerProfileRouter.delete("/", requireCompanyHeaderProfileAccess, headerProfileController.deleteMine);
