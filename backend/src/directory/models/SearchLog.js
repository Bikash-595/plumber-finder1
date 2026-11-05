import mongoose from "mongoose";

// One row per search submitted on the site (not per keystroke), for Directory & SEO → Search analytics.
// Only the query and what it was understood as are kept — no account or IP. Removed after 180 days.
const searchLogSchema = new mongoose.Schema({
  q: { type: String, trim: true, maxlength: 200 },
  intent: { type: String, maxlength: 30 },
  service: { type: String, maxlength: 60 },
  stateCode: { type: String, maxlength: 2 },
  city: { type: String, maxlength: 100 },
  limit: Number,
  results: Number,
  createdAt: { type: Date, default: Date.now },
}, { collection: "directory_search_logs", versionKey: false });

searchLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 3600 });

export const SearchLog = mongoose.model("SearchLog", searchLogSchema);
