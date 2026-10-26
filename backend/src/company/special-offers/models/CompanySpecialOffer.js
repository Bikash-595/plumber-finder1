import mongoose from "mongoose";
import { specialOfferSchemaFields } from "../../../shared/profileSections/specialOffersSection.js";

const companySpecialOfferSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  ...specialOfferSchemaFields,
}, { timestamps: true, collection: "company_special_offers" });

export const CompanySpecialOffer = mongoose.model("CompanySpecialOffer", companySpecialOfferSchema);
