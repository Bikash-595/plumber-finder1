import mongoose from "mongoose";
import { seoSchemaFields } from "../../../shared/profileSections/seoSection.js";

const companySeoSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  ...seoSchemaFields,
}, { timestamps: true, collection: "company_seo" });

export const CompanySeo = mongoose.model("CompanySeo", companySeoSchema);
