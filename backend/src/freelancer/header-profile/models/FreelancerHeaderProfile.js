import mongoose from "mongoose";

const freelancerHeaderProfileSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  photo: { type: String, maxlength: 1250000 },
  coverImage: { type: String, maxlength: 1250000 },
  coverImages: { type: [String], default: undefined },
  displayName: { type: String, required: true, trim: true, maxlength: 120 },
  headline: { type: String, trim: true, maxlength: 120 },
  bio: { type: String, trim: true, maxlength: 600 },
  yearsExperience: { type: Number, min: 0, max: 80 },
  licenseNumber: { type: String, trim: true, maxlength: 120 },
  insurance: { type: String, trim: true, maxlength: 500 },
  hourlyRate: { type: Number, min: 0, max: 10000 },
  phone: { type: String, trim: true, maxlength: 40 },
  city: { type: String, trim: true, maxlength: 100 },
  state: { type: String, trim: true, maxlength: 100 },
  isAvailable: { type: Boolean, default: true },
  published: { type: Boolean, default: true },
}, { timestamps: true, collection: "freelancer_header_profiles" });

export const FreelancerHeaderProfile = mongoose.model("FreelancerHeaderProfile", freelancerHeaderProfileSchema);
