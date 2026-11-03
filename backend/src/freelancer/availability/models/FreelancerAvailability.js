import mongoose from "mongoose";
import { availabilitySchemaFields } from "../../../company/availability/models/CompanyAvailability.js";

// When customers can book this freelancer: same rules as companies (pause, days off, daily limit, notice).
const freelancerAvailabilitySchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  ...availabilitySchemaFields,
}, { timestamps: true, collection: "freelancer_availability" });

export const FreelancerAvailability = mongoose.model("FreelancerAvailability", freelancerAvailabilitySchema);
