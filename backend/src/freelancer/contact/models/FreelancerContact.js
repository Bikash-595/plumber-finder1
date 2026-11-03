import mongoose from "mongoose";

// How customers reach the freelancer. The main phone is copied to the public listing.
const text = (max) => ({ type: String, trim: true, maxlength: max });
const freelancerContactSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  primaryPhone: text(40), secondaryPhone: text(40), whatsapp: text(40), emergencyHotline: text(40),
  email: text(200), website: text(300),
}, { timestamps: true, collection: "freelancer_contact" });

export const FreelancerContact = mongoose.model("FreelancerContact", freelancerContactSchema);
