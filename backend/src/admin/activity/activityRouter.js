import { Router } from "express";
import { requireAdmin } from "../shared/requireAdmin.js";
import { getProvider, listProviders, recentActivity } from "./activityController.js";

// Mounted at /api/admin/activity: who visited, read, compared, saved, contacted, and booked each plumber.
export const activityRouter = Router();
activityRouter.use(requireAdmin);
activityRouter.get("/providers", listProviders);
activityRouter.get("/providers/:type/:id", getProvider);
activityRouter.get("/recent", recentActivity);
