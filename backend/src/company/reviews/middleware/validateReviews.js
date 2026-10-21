import { createValidator } from "../../shared/createValidator.js";
import { reviewsConfig } from "../config/reviewsConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validateReviewsCreate = createValidator(reviewsConfig);
export const validateReviewsUpdate = createValidator(reviewsConfig, { partial: true });
