import { rateLimit } from "../../../reviews/middleware/rateLimit.js";
import { createValidator } from "../../shared/createValidator.js";
import { settingsConfig } from "../config/settingsConfig.js";

export const validatePreferences = createValidator(settingsConfig.preferences, { partial: true });
export const validateAccount = createValidator(settingsConfig.account, { partial: true });
export const validatePasswordChange = createValidator(settingsConfig.password);
// Guessing the current password through this form is limited too.
export const limitSecurityChanges = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many attempts. Please wait 15 minutes." });
