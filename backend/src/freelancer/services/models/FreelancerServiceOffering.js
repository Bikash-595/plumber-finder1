import mongoose from "mongoose";

const freelancerServiceOfferingSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 2000 },
  price: { type: String, trim: true, maxlength: 60 },
  duration: { type: String, trim: true, maxlength: 60 },
  emergency: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  image: { type: String },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "freelancer_services_offered" });

export const FreelancerServiceOffering = mongoose.model("FreelancerServiceOffering", freelancerServiceOfferingSchema);
