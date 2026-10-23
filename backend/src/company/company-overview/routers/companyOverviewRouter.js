import { Router } from "express";
import { companyOverviewController } from "../controllers/companyOverviewController.js";
import { requireCompanyCompanyOverviewAccess } from "../middleware/companyOverviewAuth.js";
import { validateCompanyOverview } from "../middleware/validateCompanyOverview.js";

export const companyOverviewRouter = Router();

// Public: shown on a published company profile (by public listing id).
companyOverviewRouter.get("/public/:listingId", companyOverviewController.getPublic);

// Signed-in company: read and save its own company overview.
companyOverviewRouter.get("/", requireCompanyCompanyOverviewAccess, companyOverviewController.getMine);
companyOverviewRouter.put("/", requireCompanyCompanyOverviewAccess, validateCompanyOverview, companyOverviewController.saveMine);
companyOverviewRouter.post("/", requireCompanyCompanyOverviewAccess, validateCompanyOverview, companyOverviewController.saveMine);
companyOverviewRouter.delete("/", requireCompanyCompanyOverviewAccess, companyOverviewController.deleteMine);
