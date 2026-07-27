import mongoose from "mongoose";
const companyProfileSchema = new mongoose.Schema({ company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", unique: true, required: true }, companyHistory: String, founderStory: String, businessGoals: String, coreValues: String, registration: { type: Object }, operations: { type: Object } }, { timestamps: true });
export const CompanyProfile = mongoose.model("CompanyProfile", companyProfileSchema);
