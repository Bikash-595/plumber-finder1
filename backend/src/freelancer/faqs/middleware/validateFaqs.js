import { createValidator } from "../../shared/createValidator.js";
import { faqsConfig } from "../config/faqsConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validateFaqsCreate = createValidator(faqsConfig);
export const validateFaqsUpdate = createValidator(faqsConfig, { partial: true });
