import mongoose from "mongoose";

// A company's Google Business Profile (companies only — freelancers don't get Google reviews).
// The Place ID is stored indefinitely (Google allows it); everything fetched from Google sits in `cache` and is
// refreshed after a day (see google/sync.js) — never shown when older, never copied into PlumberFinder reviews.
const googleBusinessLinkSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerAccount: { type: mongoose.Schema.Types.ObjectId, required: true },
  profileUrl: { type: String, trim: true, maxlength: 500 },
  placeId: { type: String, trim: true, maxlength: 300 },
  businessName: { type: String, trim: true, maxlength: 200 },
  address: { type: String, trim: true, maxlength: 300 },
  // link_only: only a Google link was given · connected: the owner confirmed this Place ID is their business.
  connectionStatus: { type: String, enum: ["link_only", "connected"], default: "link_only" },
  verifiedAt: Date,
  lastSyncedAt: Date,
  cache: {
    origin: { type: String, enum: ["places", "business_profile"] },
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
googleBusinessLinkSchema.index({ connectionStatus: 1, "cache.fetchedAt": 1 });

export const GoogleBusinessLink = mongoose.model("GoogleBusinessLink", googleBusinessLinkSchema);
