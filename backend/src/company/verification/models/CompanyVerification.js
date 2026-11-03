import mongoose from "mongoose";

const link = { type: String, trim: true, maxlength: 500 };
const companyVerificationSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  license: link,
  insurance: link,
  panVat: link,
  registrationCertificate: link,
  notes: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true, collection: "company_verification" });

export const CompanyVerification = mongoose.model("CompanyVerification", companyVerificationSchema);
