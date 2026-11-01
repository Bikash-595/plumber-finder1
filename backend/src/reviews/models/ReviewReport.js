import mongoose from "mongoose";
import { REPORT_REASONS } from "../config/reviewsConfig.js";

// A report that a review breaks the rules (one per person per review). Moderating the review resolves its reports.
const reviewReportSchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  reporter: { type: { type: String, enum: ["user", "company", "freelancer"], required: true }, id: { type: mongoose.Schema.Types.ObjectId, required: true } },
  reason: { type: String, enum: REPORT_REASONS, required: true },
  details: { type: String, trim: true, maxlength: 500 },
  resolved: { type: Boolean, default: false },
  adminAction: { type: String, trim: true, maxlength: 300 },
}, { timestamps: true, collection: "review_reports" });
reviewReportSchema.index({ review: 1, "reporter.type": 1, "reporter.id": 1 }, { unique: true });
reviewReportSchema.index({ resolved: 1, createdAt: -1 });

export const ReviewReport = mongoose.model("ReviewReport", reviewReportSchema);
