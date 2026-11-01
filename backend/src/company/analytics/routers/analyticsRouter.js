import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { requireAnalyticsAccess } from "../middleware/analyticsAuth.js";

// Mounted at /api/companies/analytics.
export const companyAnalyticsRouter = Router();
companyAnalyticsRouter.use(requireAnalyticsAccess);
companyAnalyticsRouter.get("/", getAnalytics);
