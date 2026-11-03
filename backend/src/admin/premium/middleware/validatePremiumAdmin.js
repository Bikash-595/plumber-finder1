import { createValidator } from "../../../shared/profileSections/createValidator.js";
import { premiumAdminConfig } from "../config/premiumAdminConfig.js";

export const validateActivate = createValidator(premiumAdminConfig.activate);
export const validateCancel = createValidator(premiumAdminConfig.cancel);
