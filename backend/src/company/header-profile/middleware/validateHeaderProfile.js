import { createValidator } from "../../shared/createValidator.js";
import { headerProfileConfig } from "../config/headerProfileConfig.js";

export const validateHeaderProfile = createValidator(headerProfileConfig);
