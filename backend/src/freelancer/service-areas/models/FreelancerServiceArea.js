import mongoose from "mongoose";

const freelancerServiceAreaSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  areasCovered: { type: String, trim: true, maxlength: 5000 },
  // Parsed from areasCovered so the public listing and search filters can use it.
  areas: [{ type: String, trim: true }],
  radius: { type: Number, min: 0, max: 500 },
  branchLocation: { type: String, trim: true, maxlength: 200 },
}, { timestamps: true, collection: "freelancer_service_areas" });

export const FreelancerServiceArea = mongoose.model("FreelancerServiceArea", freelancerServiceAreaSchema);
