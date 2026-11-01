import { rateLimit } from "../../../reviews/middleware/rateLimit.js";
import { createValidator } from "../../shared/createValidator.js";
import { userReviewsConfig } from "../config/reviewsConfig.js";

export const validateReviewCreate = createValidator(userReviewsConfig.create);
export const validateReviewUpdate = createValidator(userReviewsConfig.update, { partial: true });
// Bursts of writes from one account (the daily limit is checked in the controller).
export const limitReviewWrites = rateLimit({ windowMs: 10 * 60 * 1000, max: 10, message: "You're doing that too often. Please wait a few minutes." });
