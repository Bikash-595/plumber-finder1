import mongoose from "mongoose";

const companyListingSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  companyName: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
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
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export const CompanyListing = mongoose.model("CompanyListing", companyListingSchema);
