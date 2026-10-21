import mongoose from "mongoose";

const companySpecialOfferSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000 },
  discount: { type: String, trim: true, maxlength: 60 },
  promoCode: { type: String, trim: true, uppercase: true, maxlength: 40 },
  startDate: { type: Date },
  endDate: { type: Date },
  image: { type: String },
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_special_offers" });

export const CompanySpecialOffer = mongoose.model("CompanySpecialOffer", companySpecialOfferSchema);
