import mongoose from "mongoose";
import { notifyProvider } from "../notifications/AccountNotification.js";
import { notify as notifyCustomer } from "../../user/notifications/services/notify.js";
import { UserBooking } from "../../user/bookings/models/UserBooking.js";
import { Conversation, Message } from "./models.js";

const MAX_LENGTH = 2000;
const PAGE = 30;
const NOTIFY_GAP_MS = 10 * 60 * 1000; // one "new message" notification per burst, not one per message
const inboxPath = { customer: "/dashboard/messages", company: "/company-dashboard/messages", freelancer: "/freelancer/messages" };

/**
 * Messages for one side of the conversation:
 *  - "customer": req.auth.sub is the customer (User)
 *  - "company" | "freelancer": req.auth.sub is the provider account
 * Every query is scoped to that participant, so nobody can read or write someone else's conversation.
 */
export function createMessagesController(side) {
  const role = side === "customer" ? "customer" : "provider";
  const other = role === "customer" ? "provider" : "customer";
  const scope = (req) => (role === "customer" ? { user: req.auth.sub } : { providerType: side, providerAccount: req.auth.sub });
  const id = (value) => (mongoose.isValidObjectId(value) ? new mongoose.Types.ObjectId(String(value)) : null);
  const findMine = (req) => { const conversationId = id(req.params.id); return conversationId ? Conversation.findOne({ ...scope(req), _id: conversationId }) : null; };

  return {
    // GET /?page= — conversations, newest activity first, with the total unread for the badge.
    list: async (req, res, next) => {
      try {
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const filter = scope(req);
        const [data, total, unread] = await Promise.all([
          Conversation.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * PAGE).limit(PAGE).lean(),
          Conversation.countDocuments(filter),
          Conversation.aggregate([{ $match: role === "customer" ? { user: id(req.auth.sub) } : { providerType: side, providerAccount: id(req.auth.sub) } }, { $group: { _id: null, n: { $sum: `$unread.${role}` } } }]),
        ]);
        res.json({ data: data.map((c) => ({ ...c, unreadForMe: c.unread?.[role] ?? 0 })), page, limit: PAGE, total, unread: unread[0]?.n ?? 0 });
      } catch (error) { next(error); }
    },

    // POST / { bookingId } — opens (or returns) the conversation for one of my bookings.
    open: async (req, res, next) => {
      try {
        const bookingId = id(req.body?.bookingId);
        const booking = bookingId && await UserBooking.findOne({ _id: bookingId, ...(role === "customer" ? { user: req.auth.sub } : { providerType: side, providerAccount: req.auth.sub }) }).lean();
        if (!booking) return res.status(404).json({ message: "Booking not found." });
        if (!booking.providerAccount) return res.status(409).json({ message: "This plumber can't receive messages on PlumberFinder." });
        if (booking.status === "declined") return res.status(409).json({ message: "Messages aren't available for a declined booking." });
        const conversation = await Conversation.findOneAndUpdate(
          { booking: booking._id },
          { $setOnInsert: { booking: booking._id, user: booking.user, providerType: booking.providerType, providerAccount: booking.providerAccount, providerName: booking.providerName, customerName: booking.customerName, reference: booking.reference, service: booking.service } },
          { upsert: true, new: true },
        ).lean();
        res.status(201).json({ data: conversation });
      } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ message: "Please try again." });
        next(error);
      }
    },

    // GET /:id?before=<messageId> — the conversation and up to 30 messages (oldest first), older ones with `before`.
    thread: async (req, res, next) => {
      try {
        const conversation = await findMine(req);
        if (!conversation) return res.status(404).json({ message: "Conversation not found." });
        const before = id(req.query.before);
        const rows = await Message.find({ conversation: conversation._id, ...(before ? { _id: { $lt: before } } : {}) }).sort({ _id: -1 }).limit(PAGE + 1).lean();
        const booking = await UserBooking.findById(conversation.booking).select("reference service status scheduledDate timeSlot").lean();
        res.json({ data: { conversation: { ...conversation.toObject(), unreadForMe: conversation.unread?.[role] ?? 0 }, booking, messages: rows.slice(0, PAGE).reverse(), hasOlder: rows.length > PAGE, me: role } });
      } catch (error) { next(error); }
    },

    // POST /:id { body } — sends a message. The other side gets one notification per burst of messages.
    send: async (req, res, next) => {
      try {
        const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
        if (!body) return res.status(400).json({ message: "Write a message first." });
        if (body.length > MAX_LENGTH) return res.status(400).json({ message: `Messages can be up to ${MAX_LENGTH} characters.` });
        const conversation = await findMine(req);
        if (!conversation) return res.status(404).json({ message: "Conversation not found." });
        const quietBefore = !conversation.lastMessage?.at || Date.now() - new Date(conversation.lastMessage.at).getTime() > NOTIFY_GAP_MS || conversation.lastMessage.from !== role || conversation.unread[other] === 0;
        const message = await Message.create({ conversation: conversation._id, from: role, body });
        await Conversation.updateOne({ _id: conversation._id }, { $set: { lastMessage: { body: body.slice(0, 200), from: role, at: message.createdAt } }, $inc: { [`unread.${other}`]: 1 } });
        if (quietBefore) {
          const preview = body.length > 120 ? `${body.slice(0, 117)}…` : body;
          if (other === "customer") await notifyCustomer(conversation.user, { type: "booking", title: `New message from ${conversation.providerName ?? "your plumber"}`, message: preview, link: `${inboxPath.customer}?c=${conversation._id}` });
          else await notifyProvider(conversation.providerType, conversation.providerAccount, { type: "booking", title: `New message from ${conversation.customerName ?? "a customer"}`, message: preview, link: `${inboxPath[conversation.providerType]}?c=${conversation._id}` });
        }
        res.status(201).json({ data: message });
      } catch (error) { next(error); }
    },

    // PATCH /:id/read — clears my unread count.
    read: async (req, res, next) => {
      try {
        const conversation = await findMine(req);
        if (!conversation) return res.status(404).json({ message: "Conversation not found." });
        await Conversation.updateOne({ _id: conversation._id }, { $set: { [`unread.${role}`]: 0 } }, { timestamps: false });
        res.json({ message: "Marked as read." });
      } catch (error) { next(error); }
    },
  };
}
