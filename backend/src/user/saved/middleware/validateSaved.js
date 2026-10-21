import { createValidator } from "../../shared/createValidator.js";
import { savedConfig } from "../config/savedConfig.js";

export const validateSaved = createValidator(savedConfig);
