import { createValidator } from "../../shared/profileSections/createValidator.js";
import { rateLimit } from "../../reviews/middleware/rateLimit.js";
import { INTERVALS, PLAN_IDS } from "../config/plans.js";

// Only a plan id and an interval are accepted from the browser; prices come from config/plans.js.
export const validatePlanChoice = createValidator({
  label: "plan",
  fields: {
    plan: { type: "enum", values: PLAN_IDS, required: true },
    interval: { type: "enum", values: Object.keys(INTERVALS), default: "month" },
    note: { type: "text", max: 500 },
  },
});

// Starting checkouts and sending requests is limited per account (stops abuse and accidental double clicks).
export const limitPremiumActions = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many attempts. Please wait a few minutes and try again." });
