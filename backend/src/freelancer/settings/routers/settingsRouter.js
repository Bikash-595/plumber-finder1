import { Router } from "express";
import { settingsController } from "../../../company/settings/controllers/settingsController.js";
import { limitSecurityChanges, validateAccount, validatePasswordChange, validatePreferences } from "../../../company/settings/middleware/validateSettings.js";
import { requireSettingsAccess } from "../middleware/settingsAuth.js";

// Mounted at /api/freelancers/settings: email preferences, phone, password and sign-in security.
export const freelancerSettingsRouter = Router();
freelancerSettingsRouter.use(requireSettingsAccess);
freelancerSettingsRouter.get("/", settingsController.get);
freelancerSettingsRouter.put("/preferences", validatePreferences, settingsController.savePreferences);
freelancerSettingsRouter.put("/account", validateAccount, settingsController.saveAccount);
freelancerSettingsRouter.post("/password", limitSecurityChanges, validatePasswordChange, settingsController.changePassword);
freelancerSettingsRouter.post("/sign-out-everywhere", limitSecurityChanges, settingsController.signOutEverywhere);
