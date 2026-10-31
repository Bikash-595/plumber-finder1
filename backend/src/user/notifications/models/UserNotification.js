import mongoose from "mongoose";
import { notificationsConfig } from "../config/notificationsConfig.js";

const userNotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: notificationsConfig.types, default: "system" },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  message: { type: String, trim: true, maxlength: 1000 },
  link: { type: String, trim: true, maxlength: 300 },
  read: { type: Boolean, default: false },
}, { timestamps: true, collection: "user_notifications" });

userNotificationSchema.index({ user: 1, createdAt: -1 });
// Pages by _id (user/shared/paginate.js); the unread badge and "unread only" tab use { user, read }.
userNotificationSchema.index({ user: 1, _id: -1 });
userNotificationSchema.index({ user: 1, read: 1, _id: -1 });

export const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
