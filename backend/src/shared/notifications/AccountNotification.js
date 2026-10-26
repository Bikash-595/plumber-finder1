import mongoose from "mongoose";

// In-app notifications for plumbing companies, freelancers, and admins (customers have their own,
// see user/notifications). Admin notifications have no single recipient: every admin sees them.
const accountNotificationSchema = new mongoose.Schema({
  recipientType: { type: String, enum: ["company", "freelancer", "admin"], required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, default: null },
  type: { type: String, enum: ["booking", "system"], default: "system" },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  message: { type: String, trim: true, maxlength: 1000 },
  link: { type: String, trim: true, maxlength: 300 },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "UserBooking" },
  // Shows an "Accept or decline" prompt until the booking is answered.
  actionRequired: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
}, { timestamps: true, collection: "account_notifications" });

accountNotificationSchema.index({ recipientType: 1, recipient: 1, createdAt: -1 });

export const AccountNotification = mongoose.model("AccountNotification", accountNotificationSchema);

/** Notifies a company or freelancer account. */
export const notifyProvider = (recipientType, recipient, notice) => AccountNotification.create({ ...notice, recipientType, recipient });

/** Notifies every admin. */
export const notifyAdmins = (notice) => AccountNotification.create({ ...notice, recipientType: "admin", recipient: null });
