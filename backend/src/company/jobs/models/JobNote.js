import mongoose from "mongoose";

// Private notes a company keeps on a job (parts used, gate code, follow-up). Never shown to the customer.
const jobNoteSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "UserBooking", required: true },
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerAccount: { type: mongoose.Schema.Types.ObjectId, required: true },
  body: { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "job_notes" });
jobNoteSchema.index({ providerType: 1, providerAccount: 1, booking: 1, createdAt: -1 });
export const JobNote = mongoose.model("JobNote", jobNoteSchema);
