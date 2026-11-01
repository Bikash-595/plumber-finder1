import mongoose from "mongoose";

// Messages between a customer and the company/freelancer they booked: one conversation per booking.
// Only those two can read or write it; admins can see it for disputes.

const conversationSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "UserBooking", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerAccount: { type: mongoose.Schema.Types.ObjectId, required: true },
  // Shown in inboxes (copied from the booking).
  providerName: { type: String, maxlength: 150 },
  customerName: { type: String, maxlength: 120 },
  reference: { type: String, maxlength: 20 },
  service: { type: String, maxlength: 150 },
  lastMessage: { body: { type: String, maxlength: 200 }, from: { type: String, enum: ["customer", "provider"] }, at: Date },
  // Messages the other side hasn't read yet.
  unread: { customer: { type: Number, default: 0 }, provider: { type: Number, default: 0 } },
}, { timestamps: true, collection: "conversations" });
conversationSchema.index({ booking: 1 }, { unique: true });
conversationSchema.index({ providerType: 1, providerAccount: 1, updatedAt: -1 });
conversationSchema.index({ user: 1, updatedAt: -1 });
export const Conversation = mongoose.model("Conversation", conversationSchema);

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, required: true },
  from: { type: String, enum: ["customer", "provider"], required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "messages" });
messageSchema.index({ conversation: 1, _id: -1 });
export const Message = mongoose.model("Message", messageSchema);
