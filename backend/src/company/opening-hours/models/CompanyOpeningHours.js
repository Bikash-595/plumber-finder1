import mongoose from "mongoose";
import { openingHoursSchemaFields } from "../../../shared/profileSections/openingHoursSection.js";

const companyOpeningHoursSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  ...openingHoursSchemaFields,
}, { timestamps: true, collection: "company_opening_hours" });

export const CompanyOpeningHours = mongoose.model("CompanyOpeningHours", companyOpeningHoursSchema);
