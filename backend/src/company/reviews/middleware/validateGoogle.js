import { createValidator } from "../../../shared/profileSections/createValidator.js";
import { companyReviewsConfig } from "../config/reviewsConfig.js";

export const validateGoogleLink = createValidator(companyReviewsConfig.google, { partial: true });
