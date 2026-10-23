import { Router } from "express";
import { socialLinksController } from "../controllers/socialLinksController.js";
import { requireCompanySocialLinksAccess } from "../middleware/socialLinksAuth.js";
import { validateSocialLinks } from "../middleware/validateSocialLinks.js";

export const socialLinksRouter = Router();

// Public: shown on a published profile (by public listing id).
socialLinksRouter.get("/public/:listingId", socialLinksController.getPublic);

// Signed-in company: read, save, and delete its own social links.
socialLinksRouter.get("/", requireCompanySocialLinksAccess, socialLinksController.getMine);
socialLinksRouter.put("/", requireCompanySocialLinksAccess, validateSocialLinks, socialLinksController.saveMine);
socialLinksRouter.post("/", requireCompanySocialLinksAccess, validateSocialLinks, socialLinksController.saveMine);
socialLinksRouter.delete("/", requireCompanySocialLinksAccess, socialLinksController.deleteMine);
