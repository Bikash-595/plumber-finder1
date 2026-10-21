import mongoose from "mongoose";

const companyServiceAreaSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  areasCovered: { type: String, trim: true, maxlength: 5000 },
  // Parsed from areasCovered so the public listing and search filters can use it.
  areas: [{ type: String, trim: true }],
  radius: { type: Number, min: 0, max: 500 },
  branchLocation: { type: String, trim: true, maxlength: 200 },
}, { timestamps: true, collection: "company_service_areas" });

export const CompanyServiceArea = mongoose.model("CompanyServiceArea", companyServiceAreaSchema);
