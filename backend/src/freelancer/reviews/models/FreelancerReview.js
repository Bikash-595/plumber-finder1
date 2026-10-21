import mongoose from "mongoose";

const freelancerReviewSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  customer: { type: String, required: true, trim: true, maxlength: 120 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true, trim: true, maxlength: 3000 },
  photo: { type: String },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "freelancer_reviews" });

export const FreelancerReview = mongoose.model("FreelancerReview", freelancerReviewSchema);
