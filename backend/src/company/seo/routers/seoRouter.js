import { Router } from "express";
import { seoController } from "../controllers/seoController.js";
import { requireSeoAccess } from "../middleware/seoAuth.js";
import { validateSeo } from "../middleware/validateSeo.js";

// Mounted at /api/companies/seo. The public profile includes it (fullProfile → seo).
export const seoRouter = Router();
seoRouter.get("/public/:listingId", seoController.getPublic);
seoRouter.get("/", requireSeoAccess, seoController.getMine);
seoRouter.put("/", requireSeoAccess, validateSeo, seoController.saveMine);
seoRouter.delete("/", requireSeoAccess, seoController.deleteMine);
