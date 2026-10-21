import mongoose from "mongoose";

// Explicit collection name: older databases may still contain the retired onboarding "companyservices" collection.
const companyServiceOfferingSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 2000 },
  price: { type: String, trim: true, maxlength: 60 },
  duration: { type: String, trim: true, maxlength: 60 },
  emergency: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  image: { type: String },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_services_offered" });

export const CompanyServiceOffering = mongoose.model("CompanyServiceOffering", companyServiceOfferingSchema);
