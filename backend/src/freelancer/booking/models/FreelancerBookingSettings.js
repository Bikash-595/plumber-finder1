import mongoose from "mongoose";

const freelancerBookingSettingsSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  instantBooking: { type: Boolean, default: true },
  approvalRequired: { type: Boolean, default: false },
  emergencyBooking: { type: Boolean, default: false },
  workingDays: { type: String, trim: true, maxlength: 200 },
  timeSlots: { type: String, trim: true, maxlength: 300 },
  cancellationPolicy: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true, collection: "freelancer_booking_settings" });

export const FreelancerBookingSettings = mongoose.model("FreelancerBookingSettings", freelancerBookingSettingsSchema);
