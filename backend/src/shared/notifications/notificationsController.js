import mongoose from "mongoose";
import { findPage, pageParams } from "../../user/shared/paginate.js";
import { AccountNotification } from "./AccountNotification.js";

const LIST_LIMIT = 100;
const TYPES = ["booking", "review", "comment", "system"];

/**
 * Notification inbox for one kind of account: list (with the unread count), mark read, mark all read,
 * delete. Companies and freelancers see their own; admins share one inbox.
 */
export function createNotificationsController(recipientType) {
  const mine = (req) => ({ recipientType, recipient: recipientType === "admin" ? null : req.auth.sub });
  const byId = (req) => (mongoose.isValidObjectId(req.params.id) ? { ...mine(req), _id: req.params.id } : null);

  return {
    // GET /?unread=true&type=booking|review|comment|system&limit=&cursor= — newest first, one page at a time,
    // with the unread count and (first page) how many unread of each type.
    list: async (req, res, next) => {
      try {
        const filter = { ...mine(req), ...(req.query.unread === "true" ? { read: false } : {}), ...(TYPES.includes(req.query.type) ? { type: req.query.type } : {}) };
        const params = pageParams(req.query, { defaultLimit: 50, maxLimit: LIST_LIMIT });
        const [page, unread, byType] = await Promise.all([
          findPage(AccountNotification, filter, params),
          AccountNotification.countDocuments({ ...mine(req), read: false }),
          // Aggregations don't cast ids, so the recipient is converted here.
          params.cursor ? null : AccountNotification.aggregate([{ $match: { recipientType, recipient: recipientType === "admin" ? null : new mongoose.Types.ObjectId(String(req.auth.sub)), read: false } }, { $group: { _id: "$type", count: { $sum: 1 } } }]),
        ]);
        res.json({ ...page, unread, ...(byType ? { unreadByType: Object.fromEntries(byType.map((row) => [row._id, row.count])) } : {}) });
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
