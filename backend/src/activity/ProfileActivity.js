import mongoose from "mongoose";

// Everything people do with a plumber (company or freelancer): profile visits, project views, blog reads,
// compare/save, contact clicks, bookings. Admins see it per plumber and as a timeline.
export const ACTIVITY_EVENTS = ["profile_view", "project_view", "blog_read", "compare_add", "save", "call_click", "email_click", "website_click", "share", "booking"];
// Events people can repeat by refreshing: the same person counts once per 30 minutes.
export const DEDUPED_EVENTS = ["profile_view", "project_view", "blog_read", "call_click", "email_click", "website_click", "share"];
export const DEDUPE_WINDOW_MS = 30 * 60 * 1000;

const profileActivitySchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerId: { type: String, required: true, trim: true, maxlength: 64 }, // public listing id (or a sample plumber's id)
  providerAccount: { type: mongoose.Schema.Types.ObjectId, default: null },
  providerName: { type: String, trim: true, maxlength: 150 },
  event: { type: String, enum: ACTIVITY_EVENTS, required: true },
  target: { id: { type: String, maxlength: 120 }, title: { type: String, maxlength: 200 } }, // the project, blog post, or booking
  actor: { type: { type: String, enum: ["user", "company", "freelancer", "admin", "guest"], required: true }, id: { type: String, required: true, maxlength: 80 } },
  // Same person + same thing + same 30-minute window: stored once (unique index below).
  dedupeKey: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "profile_activity" });

profileActivitySchema.index({ providerType: 1, providerId: 1, createdAt: -1 });
profileActivitySchema.index({ createdAt: -1 });
profileActivitySchema.index({ dedupeKey: 1 }, { unique: true, partialFilterExpression: { dedupeKey: { $type: "string" } } });

export const ProfileActivity = mongoose.model("ProfileActivity", profileActivitySchema);
