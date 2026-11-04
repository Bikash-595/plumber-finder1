import mongoose from "mongoose";
import { seoSchemaFields } from "../../../shared/profileSections/seoSection.js";

const freelancerSeoSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  ...seoSchemaFields,
}, { timestamps: true, collection: "freelancer_seo" });

export const FreelancerSeo = mongoose.model("FreelancerSeo", freelancerSeoSchema);
