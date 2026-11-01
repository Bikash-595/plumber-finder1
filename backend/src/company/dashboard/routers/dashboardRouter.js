import { Router } from "express";
import { getDashboard, getStrength } from "../controllers/dashboardController.js";
import { requireDashboardAccess } from "../middleware/dashboardAuth.js";

// Mounted at /api/companies/dashboard.
export const companyDashboardRouter = Router();
companyDashboardRouter.use(requireDashboardAccess);
companyDashboardRouter.get("/", getDashboard);
companyDashboardRouter.get("/strength", getStrength);
