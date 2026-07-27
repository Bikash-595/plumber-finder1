import mongoose from "mongoose";

const companyHeaderProfileSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
  logo: { type: String, maxlength: 1250000 },
  coverImage: { type: String, maxlength: 1250000 },
  companyName: { type: String, required: true, trim: true, maxlength: 150 },
  ownerName: { type: String, trim: true, maxlength: 120 },
  companyType: { type: String, trim: true, maxlength: 100 },
  yearsInBusiness: { type: Number, min: 0, max: 200 },
  licenseNumber: { type: String, trim: true, maxlength: 120 },
  insurance: { type: String, trim: true, maxlength: 500 },
  certifications: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true });

export const CompanyHeaderProfile = mongoose.model("CompanyHeaderProfile", companyHeaderProfileSchema);
