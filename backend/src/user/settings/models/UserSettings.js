import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  pushNotifications: { type: Boolean, default: false },
  marketingEmails: { type: Boolean, default: false },
  bookingReminders: { type: Boolean, default: true },
  publicProfile: { type: Boolean, default: true },
}, { timestamps: true, collection: "user_settings" });

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
