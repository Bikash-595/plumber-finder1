import mongoose from "mongoose";

// Links to a freelancer's licence and insurance documents. Private: only the freelancer and admins see them.
const link = { type: String, trim: true, maxlength: 500 };
const freelancerVerificationSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  license: link,
  insurance: link,
  panVat: link,
  registrationCertificate: link,
  notes: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true, collection: "freelancer_verification" });

export const FreelancerVerification = mongoose.model("FreelancerVerification", freelancerVerificationSchema);
