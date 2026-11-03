import { Router } from "express";
import { getAnalytics } from "../../../company/analytics/controllers/analyticsController.js";
import { requireAnalyticsAccess } from "../middleware/analyticsAuth.js";

// Mounted at /api/freelancers/analytics (shared controller; the side comes from the token).
export const freelancerAnalyticsRouter = Router();
freelancerAnalyticsRouter.use(requireAnalyticsAccess);
freelancerAnalyticsRouter.get("/", getAnalytics);
