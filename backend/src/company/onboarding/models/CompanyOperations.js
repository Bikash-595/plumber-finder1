import mongoose from "mongoose";
import { weeklyHoursSchema } from "../../../shared/openingHours.js";
const companyOperationsSchema = new mongoose.Schema({ company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", unique: true, required: true }, dailyHours: String, holidayHours: String, emergencyHours: String, availability24x7: String, seasonalHours: String, specialClosures: String, weeklyHours: weeklyHoursSchema }, { timestamps: true });
export const CompanyOperations = mongoose.model("CompanyOperations", companyOperationsSchema);
