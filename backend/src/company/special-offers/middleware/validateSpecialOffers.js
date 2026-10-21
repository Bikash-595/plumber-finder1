import { createValidator } from "../../shared/createValidator.js";
import { specialOffersConfig } from "../config/specialOffersConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validateSpecialOffersCreate = createValidator(specialOffersConfig);
export const validateSpecialOffersUpdate = createValidator(specialOffersConfig, { partial: true });
