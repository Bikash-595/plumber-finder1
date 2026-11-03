import { createValidator } from "../../shared/createValidator.js";
import { locationConfig } from "../config/locationConfig.js";

export const validateLocation = createValidator(locationConfig);
