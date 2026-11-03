import mongoose from "mongoose";

// A freelancer's notification preferences. In-app notifications always arrive; these control the emails.
const freelancerSettingsSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  emailNewBooking: { type: Boolean, default: true },
  emailBookingUpdates: { type: Boolean, default: true },
  emailNewReview: { type: Boolean, default: true },
}, { timestamps: true, collection: "freelancer_settings" });

export const FreelancerSettings = mongoose.model("FreelancerSettings", freelancerSettingsSchema);
