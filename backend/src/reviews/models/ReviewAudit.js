import mongoose from "mongoose";

// Every change to a review — written, edited, held, published, hidden, rejected, replied to, reported, deleted —
// with who did it and why. Nothing here is ever edited, so moderation can always be traced.
const reviewAuditSchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ["created", "edited", "deleted", "held", "published", "hidden", "rejected", "reply", "reply_deleted", "reported"], required: true },
  actor: { type: { type: String, enum: ["user", "company", "freelancer", "admin", "system"], required: true }, id: { type: mongoose.Schema.Types.ObjectId, default: null } },
  fromStatus: String,
  toStatus: String,
  reason: { type: String, trim: true, maxlength: 300 },
  // A copy of the rating and text at that moment (so edits and deletions stay visible to admins).
  snapshot: { rating: Number, title: String, body: String },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "review_audits" });
reviewAuditSchema.index({ review: 1, createdAt: 1 });

export const ReviewAudit = mongoose.model("ReviewAudit", reviewAuditSchema);
