import mongoose from "mongoose";

const companyBranchSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  manager: { type: String, trim: true, maxlength: 120 },
  address: { type: String, trim: true, maxlength: 300 },
  city: { type: String, trim: true, maxlength: 120 },
  state: { type: String, trim: true, maxlength: 120 },
  zipCode: { type: String, trim: true, maxlength: 20 },
  phone: { type: String, trim: true, maxlength: 40 },
  email: { type: String, trim: true, maxlength: 200 },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
  services: { type: [String], default: undefined },
  hours: { type: String, trim: true, maxlength: 200 },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_branches" });

export const CompanyBranch = mongoose.model("CompanyBranch", companyBranchSchema);
