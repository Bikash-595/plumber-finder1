import mongoose from "mongoose";

const companyListingSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  companyName: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  // Slugs used before a rename; /company/<old slug> redirects to the current one.
  previousSlugs: { type: [{ type: String, lowercase: true }], default: [], index: true },
  tagline: String,
  description: String,
  logo: String,
  coverImage: String,
  phone: String,
  email: String,
  website: String,
  location: String,
  city: String,
  state: String,
  services: [{ type: String, trim: true }],
  serviceAreas: [{ type: String, trim: true }],
  isPublished: { type: Boolean, default: true },
  // Set by the premium system only (src/premium): tier and rank order the directory; `until` is when it ends.
  premium: {
    tier: { type: String, enum: ["premium", "elite"] },
    rank: { type: Number, default: 0 },
    until: Date,
  },

  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

// The directory: premium first, then newest.
companyListingSchema.index({ isPublished: 1, "premium.rank": -1, createdAt: -1 });

export const CompanyListing = mongoose.model("CompanyListing", companyListingSchema);
