import mongoose from "mongoose";

const freelancerSpecialOfferSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000 },
  discount: { type: String, trim: true, maxlength: 60 },
  promoCode: { type: String, trim: true, uppercase: true, maxlength: 40 },
  startDate: { type: Date },
  endDate: { type: Date },
  image: { type: String },
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "freelancer_special_offers" });

export const FreelancerSpecialOffer = mongoose.model("FreelancerSpecialOffer", freelancerSpecialOfferSchema);
