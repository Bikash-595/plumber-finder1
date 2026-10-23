import { Router } from "express";
import { socialLinksController } from "../controllers/socialLinksController.js";
import { requireFreelancerSocialLinksAccess } from "../middleware/socialLinksAuth.js";
import { validateSocialLinks } from "../middleware/validateSocialLinks.js";

export const socialLinksRouter = Router();

// Public: shown on a published profile (by public listing id).
socialLinksRouter.get("/public/:listingId", socialLinksController.getPublic);

// Signed-in freelancer: read, save, and delete its own social links.
socialLinksRouter.get("/", requireFreelancerSocialLinksAccess, socialLinksController.getMine);
socialLinksRouter.put("/", requireFreelancerSocialLinksAccess, validateSocialLinks, socialLinksController.saveMine);
socialLinksRouter.post("/", requireFreelancerSocialLinksAccess, validateSocialLinks, socialLinksController.saveMine);
socialLinksRouter.delete("/", requireFreelancerSocialLinksAccess, socialLinksController.deleteMine);
