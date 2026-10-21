import mongoose from "mongoose";

const companyFaqSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  question: { type: String, required: true, trim: true, maxlength: 300 },
  answer: { type: String, required: true, trim: true, maxlength: 3000 },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_faqs" });

export const CompanyFaq = mongoose.model("CompanyFaq", companyFaqSchema);
