// Fields every customer item uses to point at a plumber, plus a display snapshot
// (so saved/compare/cart lists render without extra lookups).
export const providerFields = {
  providerType: { type: "enum", values: ["company", "freelancer"], required: true },
  providerId: { type: "string", required: true, max: 64 },
  name: { type: "string", required: true, max: 150 },
  // Display-only snapshot: a full https URL or a path on this site (e.g. /Plumber.png).
  image: { type: "string", max: 2048, pattern: /^(https?:\/\/[^\s"<>]+|\/(?!\/)[^\s"<>]*)$/i, patternMessage: "must be an http(s) URL or a site path" },
  rating: { type: "number", min: 0, max: 5 },
  reviewCount: { type: "number", integer: true, min: 0, max: 1000000 },
  location: { type: "string", max: 150 },
  priceRange: { type: "string", max: 60 },
  discount: { type: "string", max: 120 },
};

export const providerSchemaFields = {
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerId: { type: String, required: true, trim: true, maxlength: 64 },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  image: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  reviewCount: { type: Number, min: 0, max: 1000000 },
  location: { type: String, trim: true, maxlength: 150 },
  priceRange: { type: String, trim: true, maxlength: 60 },
  discount: { type: String, trim: true, maxlength: 120 },
};
