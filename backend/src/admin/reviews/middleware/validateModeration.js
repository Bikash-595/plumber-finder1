import { createValidator } from "../../../shared/profileSections/createValidator.js";
import { adminReviewsConfig } from "../config/reviewsConfig.js";

export const validateModeration = createValidator(adminReviewsConfig.moderate);
