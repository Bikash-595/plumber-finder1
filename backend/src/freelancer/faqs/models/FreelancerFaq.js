import mongoose from "mongoose";

const freelancerFaqSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  question: { type: String, required: true, trim: true, maxlength: 300 },
  answer: { type: String, required: true, trim: true, maxlength: 3000 },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "freelancer_faqs" });

export const FreelancerFaq = mongoose.model("FreelancerFaq", freelancerFaqSchema);
