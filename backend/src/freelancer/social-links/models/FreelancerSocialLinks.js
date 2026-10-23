import mongoose from "mongoose";
import { socialLinksSchemaFields } from "../../../shared/profileSections/socialLinks.js";

const freelancerSocialLinksSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  ...socialLinksSchemaFields,
}, { timestamps: true, collection: "freelancer_social_links" });

export const FreelancerSocialLinks = mongoose.model("FreelancerSocialLinks", freelancerSocialLinksSchema);
