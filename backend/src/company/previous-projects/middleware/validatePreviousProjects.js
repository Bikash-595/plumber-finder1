import { createValidator } from "../../shared/createValidator.js";
import { previousProjectsConfig } from "../config/previousProjectsConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validatePreviousProjectsCreate = createValidator(previousProjectsConfig);
export const validatePreviousProjectsUpdate = createValidator(previousProjectsConfig, { partial: true });
