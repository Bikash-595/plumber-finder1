import mongoose from "mongoose";
const companyOperationsSchema = new mongoose.Schema({ company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", unique: true, required: true }, dailyHours: String, holidayHours: String, emergencyHours: String, availability24x7: String, seasonalHours: String, specialClosures: String }, { timestamps: true });
export const CompanyOperations = mongoose.model("CompanyOperations", companyOperationsSchema);
