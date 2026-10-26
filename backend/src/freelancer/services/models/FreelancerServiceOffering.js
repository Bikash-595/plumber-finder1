import mongoose from "mongoose";
import { serviceSchemaFields } from "../../../shared/profileSections/servicesSection.js";

const freelancerServiceOfferingSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  ...serviceSchemaFields,
}, { timestamps: true, collection: "freelancer_services_offered" });

export const FreelancerServiceOffering = mongoose.model("FreelancerServiceOffering", freelancerServiceOfferingSchema);
