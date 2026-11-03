import { sideOf } from "../../../shared/business/sides.js";
import { blockedDays } from "../services/checkAvailability.js";

const DAY_MS = 86_400_000;
const defaults = { acceptingBookings: true, pauseMessage: "", maxJobsPerDay: 0, minNoticeDays: 0, timeOff: [] };
const today = () => { const now = new Date(); return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); };

// Companies and freelancers share this controller: signed-in routes use the account's side, the public route
// the router's side (useSide).
export const availabilityController = {
  // GET / — the account's rules (defaults until saved).
  get: async (req, res, next) => {
    try {
      const side = sideOf(req);
      const doc = await side.Availability.findOne({ [side.ownerField]: req.auth.sub }).lean();
      res.json({ data: { ...defaults, ...(doc ?? {}), timeOff: (doc?.timeOff ?? []).sort((a, b) => new Date(a.start) - new Date(b.start)) } });
    } catch (error) { next(error); }
  },

  // PUT / { acceptingBookings?, pauseMessage?, maxJobsPerDay?, minNoticeDays?, timeOff? }
  save: async (req, res, next) => {
    try {
      const values = { ...req.validated };
      // Past periods are dropped so the list stays short.
      if (values.timeOff) values.timeOff = values.timeOff.filter((period) => period.end >= today());
      const side = sideOf(req);
      const doc = await side.Availability.findOneAndUpdate({ [side.ownerField]: req.auth.sub }, { $set: values }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
      res.json({ message: doc.acceptingBookings ? "Availability saved." : "Saved. New booking requests are paused.", data: { ...defaults, ...doc } });
    } catch (error) { next(error); }
  },

  // GET /public/:listingId — for booking forms: paused?, minimum notice, and days off in the next 90 days.
  getPublic: async (req, res, next) => {
    try {
      const side = sideOf(req);
      const listing = /^[a-f0-9]{24}$/i.test(req.params.listingId) ? await side.Listing.findOne({ _id: req.params.listingId, isPublished: true }).select(side.ownerField).lean() : null;
      if (!listing) return res.json({ data: { acceptingBookings: true, minNoticeDays: 0, blockedDays: [] } });
      const doc = await side.Availability.findOne({ [side.ownerField]: listing[side.ownerField] }).lean();
      res.json({ data: { acceptingBookings: doc?.acceptingBookings !== false, pauseMessage: doc?.acceptingBookings === false ? doc.pauseMessage || null : null, minNoticeDays: doc?.minNoticeDays ?? 0, blockedDays: blockedDays(doc?.timeOff, today(), new Date(today().getTime() + 90 * DAY_MS)) } });
    } catch (error) { next(error); }
  },
};
