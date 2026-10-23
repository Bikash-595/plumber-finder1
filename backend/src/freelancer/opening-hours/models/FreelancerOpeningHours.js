import mongoose from "mongoose";
import { weeklyHoursSchema } from "../../../shared/openingHours.js";

const freelancerOpeningHoursSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  weeklyHours: { type: weeklyHoursSchema, default: [] },
  availability24x7: { type: Boolean, default: false },
  emergencyHours: { type: String, trim: true, maxlength: 1000 },
  holidayHours: { type: String, trim: true, maxlength: 1000 },
  specialClosures: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true, collection: "freelancer_opening_hours" });

export const FreelancerOpeningHours = mongoose.model("FreelancerOpeningHours", freelancerOpeningHoursSchema);
