import mongoose from "mongoose";

const companyReviewSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  customer: { type: String, required: true, trim: true, maxlength: 120 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true, trim: true, maxlength: 3000 },
  photo: { type: String },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_reviews" });

export const CompanyReview = mongoose.model("CompanyReview", companyReviewSchema);
