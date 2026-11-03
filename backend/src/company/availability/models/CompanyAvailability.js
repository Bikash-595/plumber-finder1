import mongoose from "mongoose";

const timeOffSchema = new mongoose.Schema({ start: { type: Date, required: true }, end: { type: Date, required: true }, reason: { type: String, trim: true, maxlength: 120 } }, { _id: true });

/** The booking rules, shared with freelancers (FreelancerAvailability); the owner field is added by each model. */
export const availabilitySchemaFields = {
  acceptingBookings: { type: Boolean, default: true },
  pauseMessage: { type: String, trim: true, maxlength: 200 },
  maxJobsPerDay: { type: Number, default: 0, min: 0 },
  minNoticeDays: { type: Number, default: 0, min: 0 },
  timeOff: { type: [timeOffSchema], default: [] },
};

const companyAvailabilitySchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  ...availabilitySchemaFields,
}, { timestamps: true, collection: "company_availability" });

export const CompanyAvailability = mongoose.model("CompanyAvailability", companyAvailabilitySchema);
