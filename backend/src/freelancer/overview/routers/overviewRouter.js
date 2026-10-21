import { Router } from "express";
import { overviewController } from "../controllers/overviewController.js";
import { requireFreelancerOverviewAccess } from "../middleware/overviewAuth.js";
import { validateOverview } from "../middleware/validateOverview.js";

export const overviewRouter = Router();

// Public: shown on a published freelancer profile (by public listing id).
overviewRouter.get("/public/:listingId", overviewController.getPublic);

// Signed-in freelancer: read and save its own overview.
overviewRouter.get("/", requireFreelancerOverviewAccess, overviewController.getMine);
overviewRouter.put("/", requireFreelancerOverviewAccess, validateOverview, overviewController.saveMine);
overviewRouter.post("/", requireFreelancerOverviewAccess, validateOverview, overviewController.saveMine);
