import { createValidator } from "../../shared/createValidator.js";
import { serviceAreasConfig } from "../config/serviceAreasConfig.js";

export const validateServiceAreas = createValidator(serviceAreasConfig);
