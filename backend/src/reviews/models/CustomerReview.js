import mongoose from "mongoose";
import { PROVIDER_TYPES, REVIEW_SOURCES, REVIEW_STATUSES } from "../config/reviewsConfig.js";

// PlumberFinder reviews written by signed-in customers about a company or freelancer.
// Google reviews are never stored here (see GoogleBusinessLink).
const customerReviewSchema = new mongoose.Schema({
  providerType: { type: String, enum: PROVIDER_TYPES, required: true },
  providerId: { type: String, required: true, trim: true, maxlength: 64 }, // public listing id (or a sample plumber's id)
  providerAccount: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  providerName: { type: String, trim: true, maxlength: 150 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, trim: true, maxlength: 120 }, // as it was when they reviewed
  // directory: no booking needed · verified_booking: set only by the server for the customer's own completed booking.
  source: { type: String, enum: REVIEW_SOURCES, required: true, default: "directory" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 120 },
  body: { type: String, required: true, trim: true, maxlength: 3000 },
  serviceCategory: { type: String, trim: true, maxlength: 80 },
  photos: { type: [String], default: undefined },
  booking: { type: mongoose.Schema.Types.ObjectId, default: null },
  bookingReference: { type: String, trim: true, maxlength: 20 },
  verified: { type: Boolean, default: false }, // = source is verified_booking (kept for older screens)
  status: { type: String, enum: REVIEW_STATUSES, default: "published" },
  moderation: { reason: String, by: { type: String, enum: ["system", "admin"] }, at: Date },
  reportCount: { type: Number, default: 0 },
  // The company's or freelancer's public reply.
  reply: { body: { type: String, trim: true, maxlength: 1500 }, createdAt: Date, updatedAt: Date },
  edited: { type: Boolean, default: false },
  editedAt: Date,
}, { timestamps: true, collection: "customer_reviews" });

customerReviewSchema.pre("validate", function keepVerifiedInStep() {
  this.verified = this.source === "verified_booking";
  if (this.source === "directory") this.booking = null;
});

// One directory review per customer per plumber (they can edit it) …
customerReviewSchema.index({ providerType: 1, providerId: 1, user: 1 }, { name: "one_directory_review_per_customer", unique: true, partialFilterExpression: { source: "directory" } });
// … and one verified review per booking.
customerReviewSchema.index({ booking: 1 }, { name: "one_review_per_booking", unique: true, partialFilterExpression: { booking: { $type: "objectId" } } });
customerReviewSchema.index({ providerType: 1, providerId: 1, status: 1, createdAt: -1 });
customerReviewSchema.index({ providerType: 1, providerAccount: 1, source: 1, status: 1 });
customerReviewSchema.index({ user: 1, _id: -1 });
customerReviewSchema.index({ source: 1, status: 1, createdAt: -1 });
customerReviewSchema.index({ status: 1, updatedAt: -1 });

export const CustomerReview = mongoose.model("CustomerReview", customerReviewSchema);
