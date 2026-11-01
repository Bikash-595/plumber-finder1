import mongoose from "mongoose";

// "Please review your plumber" messages for a completed booking: the request and its reminders. Each row is
// sent at most once — `idempotencyKey` (booking + kind) is unique, and the scheduler claims a row atomically
// before sending, so retries and several servers never send duplicates.
const reviewRequestSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "UserBooking", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerId: { type: String, required: true },
  providerAccount: { type: mongoose.Schema.Types.ObjectId, default: null },
  providerName: { type: String, trim: true, maxlength: 150 },
  kind: { type: String, enum: ["request", "reminder_24h", "reminder_72h"], required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ["scheduled", "sending", "sent", "cancelled", "failed"], default: "scheduled" },
  sentAt: Date,
  claimedAt: Date,
  attemptCount: { type: Number, default: 0 },
  emailed: { type: Boolean, default: false },
  lastError: { type: String, maxlength: 300 },
  cancelReason: { type: String, maxlength: 120 },
  idempotencyKey: { type: String, required: true },
}, { timestamps: true, collection: "review_requests" });

reviewRequestSchema.index({ idempotencyKey: 1 }, { unique: true });
reviewRequestSchema.index({ status: 1, scheduledAt: 1 });
reviewRequestSchema.index({ booking: 1 });
reviewRequestSchema.index({ user: 1, status: 1 });

export const ReviewRequest = mongoose.model("ReviewRequest", reviewRequestSchema);
