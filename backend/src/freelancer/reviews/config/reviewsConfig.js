// Reviews the freelancer has collected and chooses to display.
// These are freelancer-managed, so they deliberately do NOT change the listing's public star rating.
export const reviewsConfig = {
  label: "Review",
  labelPlural: "reviews",
  maxItems: 500,
  fields: {
    customer: { type: "string", required: true, max: 120 },
    rating: { type: "number", required: true, min: 1, max: 5 },
    review: { type: "text", required: true, max: 3000 },
    photo: { type: "image" },
  },
};
