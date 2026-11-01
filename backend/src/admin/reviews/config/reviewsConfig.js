import { PROVIDER_TYPES, REVIEW_SOURCES, REVIEW_STATUSES } from "../../../reviews/config/reviewsConfig.js";

// Review moderation. Admins can publish a held review, hide or restore one, or reject one that was held —
// always with a reason, which is logged (ReviewAudit) and sent to the reviewer. Ratings and text are never edited.
export const adminReviewsConfig = {
  statuses: REVIEW_STATUSES,
  sources: REVIEW_SOURCES,
  providerTypes: PROVIDER_TYPES,
  moderate: {
    label: "moderation",
    fields: {
      status: { type: "enum", values: ["published", "hidden", "rejected"], required: true },
      reason: { type: "text", max: 300 },
    },
  },
};
