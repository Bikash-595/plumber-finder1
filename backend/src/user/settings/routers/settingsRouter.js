import { Router } from "express";
import { settingsController } from "../controllers/settingsController.js";
import { requireSettingsAccess } from "../middleware/settingsAuth.js";
import { validateSettings } from "../middleware/validateSettings.js";

// Mounted at /api/users/settings.
export const settingsRouter = Router();
settingsRouter.use(requireSettingsAccess);
settingsRouter.get("/", settingsController.get);
settingsRouter.put("/", validateSettings, settingsController.save);
