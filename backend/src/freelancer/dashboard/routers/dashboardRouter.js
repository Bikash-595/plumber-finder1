import { Router } from "express";
import { getDashboard, getStrength } from "../../../company/dashboard/controllers/dashboardController.js";
import { requireDashboardAccess } from "../middleware/dashboardAuth.js";

// Mounted at /api/freelancers/dashboard. The controller serves both account types (side from the token);
// the freelancer's own profile checklist is in ../services/profileStrength.js.
export const freelancerDashboardRouter = Router();
freelancerDashboardRouter.use(requireDashboardAccess);
freelancerDashboardRouter.get("/", getDashboard);
freelancerDashboardRouter.get("/strength", getStrength);
