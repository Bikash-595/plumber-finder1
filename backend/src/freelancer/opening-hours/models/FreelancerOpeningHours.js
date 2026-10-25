import mongoose from "mongoose";
import { openingHoursSchemaFields } from "../../../shared/profileSections/openingHoursSection.js";

const freelancerOpeningHoursSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  ...openingHoursSchemaFields,
}, { timestamps: true, collection: "freelancer_opening_hours" });

export const FreelancerOpeningHours = mongoose.model("FreelancerOpeningHours", freelancerOpeningHoursSchema);
