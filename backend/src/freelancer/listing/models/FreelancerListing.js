import mongoose from "mongoose";

// The freelancer's public card in the directory. Created/updated from the Header Profile;
// `services` and `serviceAreas` are synced from those sections.
const freelancerListingSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  displayName: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  headline: { type: String, trim: true, maxlength: 120 },
  photo: { type: String },
  coverImage: { type: String },
  coverImages: { type: [String], default: undefined },
  phone: { type: String, trim: true, maxlength: 40 },
  city: { type: String, trim: true, maxlength: 100 },
  state: { type: String, trim: true, maxlength: 100 },
  hourlyRate: { type: Number, min: 0 },
  yearsExperience: { type: Number, min: 0 },
  services: [{ type: String, trim: true }],
  serviceAreas: [{ type: String, trim: true }],
  isAvailable: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: true },
  // Set by the premium system only (src/premium): tier and rank order the directory; `until` is when it ends.
  premium: {
    tier: { type: String, enum: ["premium", "elite"] },
    rank: { type: Number, default: 0 },
    until: Date,
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true, collection: "freelancer_listings" });

// The directory: premium first, then newest.
freelancerListingSchema.index({ isPublished: 1, "premium.rank": -1, createdAt: -1 });

export const FreelancerListing = mongoose.model("FreelancerListing", freelancerListingSchema);
