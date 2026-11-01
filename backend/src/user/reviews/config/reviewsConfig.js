import { PROVIDER_TYPES, reviewFields } from "../../../reviews/config/reviewsConfig.js";

// A customer's own reviews. Writing one names the plumber (directory review) or one of the customer's completed
// bookings (verified review — the server checks it and takes the plumber from the booking, not from the request).
export const userReviewsConfig = {
  create: {
    label: "review",
    fields: {
      providerType: { type: "enum", values: PROVIDER_TYPES, required: true },
      providerId: { type: "string", required: true, max: 64 },
      providerName: { type: "string", max: 150 }, // only used for the site's sample plumbers
      bookingId: { type: "string", max: 24, pattern: /^[a-f0-9]{24}$/i, patternMessage: "is not a booking id" },
      ...reviewFields,
    },
  },
  update: { label: "review", fields: reviewFields },
};
