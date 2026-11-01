import { Router } from "express";
import { settingsController } from "../controllers/settingsController.js";
import { requireSettingsAccess } from "../middleware/settingsAuth.js";
import { limitSecurityChanges, validateAccount, validatePasswordChange, validatePreferences } from "../middleware/validateSettings.js";

// Mounted at /api/companies/settings.
export const companySettingsRouter = Router();
companySettingsRouter.use(requireSettingsAccess);
companySettingsRouter.get("/", settingsController.get);
companySettingsRouter.put("/preferences", validatePreferences, settingsController.savePreferences);
companySettingsRouter.put("/account", validateAccount, settingsController.saveAccount);
companySettingsRouter.post("/password", limitSecurityChanges, validatePasswordChange, settingsController.changePassword);
companySettingsRouter.post("/sign-out-everywhere", limitSecurityChanges, settingsController.signOutEverywhere);
