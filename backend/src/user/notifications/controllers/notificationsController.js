import { notificationsConfig } from "../config/notificationsConfig.js";
import { UserNotification } from "../models/UserNotification.js";

const notFound = (res) => res.status(404).json({ message: "Notification not found." });

export const notificationsController = {
  // GET /?unread=true
  list: async (req, res, next) => {
    try {
      const filter = { user: req.auth.sub, ...(req.query.unread === "true" ? { read: false } : {}) };
      const [data, unreadCount] = await Promise.all([
        UserNotification.find(filter).sort({ createdAt: -1 }).limit(notificationsConfig.listLimit),
        UserNotification.countDocuments({ user: req.auth.sub, read: false }),
      ]);
      res.json({ data, unreadCount });
    } catch (error) { next(error); }
  },

  markRead: async (req, res, next) => {
    try {
      const doc = await UserNotification.findOneAndUpdate({ _id: req.params.id, user: req.auth.sub }, { $set: { read: true } }, { new: true });
      if (!doc) return notFound(res);
      res.json({ data: doc });
    } catch (error) { next(error); }
  },

  markAllRead: async (req, res, next) => {
    try {
      const { modifiedCount } = await UserNotification.updateMany({ user: req.auth.sub, read: false }, { $set: { read: true } });
      res.json({ message: "All notifications marked as read.", data: { updated: modifiedCount } });
    } catch (error) { next(error); }
  },

  remove: async (req, res, next) => {
    try {
      const doc = await UserNotification.findOneAndDelete({ _id: req.params.id, user: req.auth.sub });
      if (!doc) return notFound(res);
      res.json({ message: "Notification deleted.", data: { _id: doc._id } });
    } catch (error) { next(error); }
  },
};
