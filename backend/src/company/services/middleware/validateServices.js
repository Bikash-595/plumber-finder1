import { createValidator } from "../../shared/createValidator.js";
import { servicesConfig } from "../config/servicesConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validateServicesCreate = createValidator(servicesConfig);
export const validateServicesUpdate = createValidator(servicesConfig, { partial: true });
