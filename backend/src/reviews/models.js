import mongoose from "mongoose";

// PlumberFinder reviews: written by signed-in customers about a company or freelancer. They are the only
// source of a plumber's PlumberFinder rating. Google reviews are kept apart (GoogleBusinessLink below) and
// are never copied in here or counted here.

export const REVIEW_STATUSES = ["published", "pending", "hidden"]; // pending = held for moderation; hidden = removed by an admin
export const SERVICE_CATEGORIES = ["Leak repair", "Drain cleaning", "Water heater", "Toilet & fixtures", "Pipe repair & repiping", "Sewer line", "Gas line", "Emergency plumbing", "Bathroom & kitchen", "Inspection & maintenance", "Commercial plumbing", "Other"];
export const REPORT_REASONS = ["spam", "offensive", "fake", "not_relevant", "personal_info", "other"];

const customerReviewSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerId: { type: String, required: true, trim: true, maxlength: 64 }, // public listing id (or a sample plumber's id)
  providerAccount: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  providerName: { type: String, trim: true, maxlength: 150 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  userName: { type: String, trim: true, maxlength: 120 }, // as it was when they reviewed
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  body: { type: String, required: true, trim: true, maxlength: 3000 },
  serviceCategory: { type: String, trim: true, maxlength: 80 },
  photos: { type: [String], default: undefined },
  // The booking it's about (optional); "verified" when that booking was completed by this customer.
  booking: { type: mongoose.Schema.Types.ObjectId, default: null },
  bookingReference: { type: String, trim: true, maxlength: 20 },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: REVIEW_STATUSES, default: "published", index: true },
  moderation: { reason: String, by: { type: String, enum: ["system", "admin"] }, at: Date },
  reportCount: { type: Number, default: 0 },
  // The company's or freelancer's public reply.
  reply: { body: { type: String, trim: true, maxlength: 1500 }, createdAt: Date, updatedAt: Date },
  edited: { type: Boolean, default: false },
  editedAt: Date,
}, { timestamps: true, collection: "customer_reviews" });

// One review per customer per plumber (they can edit it), and one per booking.
customerReviewSchema.index({ providerType: 1, providerId: 1, user: 1 }, { unique: true });
customerReviewSchema.index({ booking: 1 }, { unique: true, partialFilterExpression: { booking: { $type: "objectId" } } });
customerReviewSchema.index({ providerType: 1, providerId: 1, status: 1, createdAt: -1 });
// A customer's own reviews (dashboard "My reviews"), newest first.
customerReviewSchema.index({ user: 1, _id: -1 });
export const CustomerReview = mongoose.model("CustomerReview", customerReviewSchema);

// A report that a review breaks the rules (one per person per review).
const reviewReportSchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  reporter: { type: { type: String, enum: ["user", "company", "freelancer"], required: true }, id: { type: mongoose.Schema.Types.ObjectId, required: true } },
  reason: { type: String, enum: REPORT_REASONS, required: true },
  details: { type: String, trim: true, maxlength: 500 },
  resolved: { type: Boolean, default: false },
}, { timestamps: true, collection: "review_reports" });
reviewReportSchema.index({ review: 1, "reporter.type": 1, "reporter.id": 1 }, { unique: true });
export const ReviewReport = mongoose.model("ReviewReport", reviewReportSchema);

// A company's or freelancer's Google Business Profile: the link they gave, the Google Place ID (stored
// indefinitely, as Google allows), and the last data fetched from the Places API — kept briefly only
// (see google.js), with the fetch time so it's refreshed rather than stored long-term.
const googleBusinessLinkSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerAccount: { type: mongoose.Schema.Types.ObjectId, required: true },
  profileUrl: { type: String, trim: true, maxlength: 500 },
  placeId: { type: String, trim: true, maxlength: 300 },
  cache: {
    rating: Number,
    userRatingCount: Number,
    googleMapsUri: String,
    displayName: String,
    reviews: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    fetchedAt: Date,
  },
  lastError: { message: String, at: Date },
}, { timestamps: true, collection: "google_business_links" });
googleBusinessLinkSchema.index({ providerType: 1, providerAccount: 1 }, { unique: true });
export const GoogleBusinessLink = mongoose.model("GoogleBusinessLink", googleBusinessLinkSchema);
