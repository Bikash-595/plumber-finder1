import mongoose from "mongoose";

const companySavedReplySchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 60 },
  body: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { type: String, enum: ["message", "decline", "follow-up", "other"], default: "message" },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_saved_replies" });

export const CompanySavedReply = mongoose.model("CompanySavedReply", companySavedReplySchema);
