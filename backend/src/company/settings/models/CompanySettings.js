import mongoose from "mongoose";

// A company's notification preferences. In-app notifications always arrive; these control the emails.
const companySettingsSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  emailNewBooking: { type: Boolean, default: true },     // a customer sends a booking request
  emailBookingUpdates: { type: Boolean, default: true }, // a customer cancels, confirms or disputes a job
  emailNewReview: { type: Boolean, default: true },      // a new PlumberFinder review
}, { timestamps: true, collection: "company_settings" });

export const CompanySettings = mongoose.model("CompanySettings", companySettingsSchema);
export const EMAIL_PREFERENCES = ["emailNewBooking", "emailBookingUpdates", "emailNewReview"];
