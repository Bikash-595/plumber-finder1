import mongoose from "mongoose";

// Message templates a freelancer inserts with one click ("On my way", "Here's your quote" …).
const freelancerSavedReplySchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 60 },
  body: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { type: String, enum: ["message", "decline", "follow-up", "other"], default: "message" },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "freelancer_saved_replies" });

export const FreelancerSavedReply = mongoose.model("FreelancerSavedReply", freelancerSavedReplySchema);
