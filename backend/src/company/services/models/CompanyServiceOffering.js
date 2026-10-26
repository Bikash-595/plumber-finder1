import mongoose from "mongoose";
import { serviceSchemaFields } from "../../../shared/profileSections/servicesSection.js";

// Explicit collection name: older databases may still contain the retired onboarding "companyservices" collection.
const companyServiceOfferingSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  ...serviceSchemaFields,
}, { timestamps: true, collection: "company_services_offered" });

export const CompanyServiceOffering = mongoose.model("CompanyServiceOffering", companyServiceOfferingSchema);
