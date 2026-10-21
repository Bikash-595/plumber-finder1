import { createValidator } from "../../../shared/profileSections/createValidator.js";
import { freelancersConfig } from "../config/freelancersConfig.js";

export const validateFreelancersStatus = createValidator({ label: "status", fields: freelancersConfig.statusFields });
