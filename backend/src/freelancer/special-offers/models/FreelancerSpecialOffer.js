import mongoose from "mongoose";
import { specialOfferSchemaFields } from "../../../shared/profileSections/specialOffersSection.js";

const freelancerSpecialOfferSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  ...specialOfferSchemaFields,
}, { timestamps: true, collection: "freelancer_special_offers" });

export const FreelancerSpecialOffer = mongoose.model("FreelancerSpecialOffer", freelancerSpecialOfferSchema);
