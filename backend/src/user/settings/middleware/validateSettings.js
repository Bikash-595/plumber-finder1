import { createValidator } from "../../shared/createValidator.js";
import { settingsConfig } from "../config/settingsConfig.js";

export const validateSettings = createValidator(settingsConfig);
