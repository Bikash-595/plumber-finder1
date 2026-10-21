import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { requireDashboardAccess } from "../middleware/dashboardAuth.js";

// Mounted at /api/users/dashboard.
export const dashboardRouter = Router();
dashboardRouter.get("/", requireDashboardAccess, getDashboardSummary);
