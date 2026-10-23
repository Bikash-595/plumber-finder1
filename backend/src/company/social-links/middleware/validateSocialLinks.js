import { createValidator } from "../../shared/createValidator.js";
import { socialLinksConfig } from "../config/socialLinksConfig.js";

export const validateSocialLinks = createValidator(socialLinksConfig);
