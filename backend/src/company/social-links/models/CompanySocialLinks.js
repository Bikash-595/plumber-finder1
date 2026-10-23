import mongoose from "mongoose";
import { socialLinksSchemaFields } from "../../../shared/profileSections/socialLinks.js";

const companySocialLinksSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  ...socialLinksSchemaFields,
}, { timestamps: true, collection: "company_social_links" });

export const CompanySocialLinks = mongoose.model("CompanySocialLinks", companySocialLinksSchema);
