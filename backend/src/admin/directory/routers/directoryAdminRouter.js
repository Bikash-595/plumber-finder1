import { Router } from "express";
import { requireAdmin } from "../../shared/requireAdmin.js";
import { directoryAdminController as directory } from "../controllers/directoryAdminController.js";

// Mounted at /api/admin/directory (Directory & SEO in the admin app). Active admins only.
export const directoryAdminRouter = Router();
directoryAdminRouter.use(requireAdmin);
directoryAdminRouter.get("/config", directory.getConfig);
directoryAdminRouter.put("/config", directory.updateConfig);
directoryAdminRouter.get("/preview", directory.preview);
directoryAdminRouter.get("/search-stats", directory.searchStats);
