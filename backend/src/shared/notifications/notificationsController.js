import mongoose from "mongoose";
import { AccountNotification } from "./AccountNotification.js";

const LIST_LIMIT = 100;

/**
 * Notification inbox for one kind of account: list (with the unread count), mark read, mark all read,
 * delete. Companies and freelancers see their own; admins share one inbox.
 */
export function createNotificationsController(recipientType) {
  const mine = (req) => ({ recipientType, recipient: recipientType === "admin" ? null : req.auth.sub });
  const byId = (req) => (mongoose.isValidObjectId(req.params.id) ? { ...mine(req), _id: req.params.id } : null);

  return {
    // GET /?unread=true
    list: async (req, res, next) => {
      try {
        const filter = { ...mine(req), ...(req.query.unread === "true" ? { read: false } : {}) };
        const [data, unread] = await Promise.all([
          AccountNotification.find(filter).sort({ createdAt: -1 }).limit(LIST_LIMIT).lean(),
          AccountNotification.countDocuments({ ...mine(req), read: false }),
        ]);
        res.json({ data, unread });
      } catch (error) { next(error); }
    },
    // GET /unread-count — for the bell in the navbar.
    unreadCount: async (req, res, next) => {
      try { res.json({ data: { unread: await AccountNotification.countDocuments({ ...mine(req), read: false }) } }); } catch (error) { next(error); }
    },
    markRead: async (req, res, next) => {
      try {
        const filter = byId(req);
        const item = filter && await AccountNotification.findOneAndUpdate(filter, { $set: { read: true } }, { new: true });
        if (!item) return res.status(404).json({ message: "Notification not found." });
        res.json({ data: item });
      } catch (error) { next(error); }
    },
    markAllRead: async (req, res, next) => {
      try {
        const { modifiedCount } = await AccountNotification.updateMany({ ...mine(req), read: false }, { $set: { read: true } });
        res.json({ message: "All notifications marked as read.", data: { updated: modifiedCount } });
      } catch (error) { next(error); }
    },
    remove: async (req, res, next) => {
      try {
        const filter = byId(req);
        const item = filter && await AccountNotification.findOneAndDelete(filter);
        if (!item) return res.status(404).json({ message: "Notification not found." });
        res.json({ message: "Notification deleted." });
      } catch (error) { next(error); }
    },
  };
}
