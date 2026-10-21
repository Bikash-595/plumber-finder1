import mongoose from "mongoose";

const freelancerOverviewSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  bio: { type: String, trim: true, maxlength: 3000 },
  specialties: [{ type: String, trim: true, maxlength: 60 }],
  certifications: { type: String, trim: true, maxlength: 2000 },
  languages: [{ type: String, trim: true, maxlength: 40 }],
  responseTime: { type: String, trim: true, maxlength: 120 },
  jobsCompleted: { type: Number, min: 0, max: 1000000 },
  averageCost: { type: Number, min: 0, max: 1000000 },
  emergencyAvailable: { type: Boolean, default: false },
}, { timestamps: true, collection: "freelancer_overviews" });

export const FreelancerOverview = mongoose.model("FreelancerOverview", freelancerOverviewSchema);
