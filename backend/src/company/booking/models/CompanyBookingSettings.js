import mongoose from "mongoose";

const companyBookingSettingsSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  instantBooking: { type: Boolean, default: true },
  approvalRequired: { type: Boolean, default: false },
  emergencyBooking: { type: Boolean, default: false },
  workingDays: { type: String, trim: true, maxlength: 200 },
  timeSlots: { type: String, trim: true, maxlength: 300 },
  cancellationPolicy: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true, collection: "company_booking_settings" });

export const CompanyBookingSettings = mongoose.model("CompanyBookingSettings", companyBookingSettingsSchema);
