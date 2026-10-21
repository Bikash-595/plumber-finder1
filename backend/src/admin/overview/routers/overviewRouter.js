import { Router } from "express";
import { getOverview } from "../controllers/overviewController.js";
import { requireOverviewAccess } from "../middleware/overviewAuth.js";

// Mounted at /api/admin/overview.
export const overviewRouter = Router();
overviewRouter.get("/", requireOverviewAccess, getOverview);
