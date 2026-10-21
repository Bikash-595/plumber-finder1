import mongoose from "mongoose";

const companyOverviewSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  foundedYear: { type: Number, min: 1800 },
  yearsInBusiness: { type: Number, min: 0, max: 200 },
  teamSize: { type: Number, min: 0 },
  licenseNumber: { type: String, trim: true, maxlength: 120 },
  insurance: { type: String, trim: true, maxlength: 300 },
  responseTime: { type: String, trim: true, maxlength: 120 },
  serviceAreaCount: { type: Number, min: 0 },
  averageCost: { type: Number, min: 0 },
  projectsCompleted: { type: Number, min: 0 },
  certifications: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true, collection: "company_overviews" });

export const CompanyOverview = mongoose.model("CompanyOverview", companyOverviewSchema);
