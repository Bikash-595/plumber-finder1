import mongoose from "mongoose";
import { Router } from "express";
import { requireAuth } from "../auth/shared/middleware/requireAuth.js";
import { verifyAccessToken } from "../auth/shared/services/tokens.js";
import { User } from "../auth/user/models/User.js";
import { resolveProvider } from "../activity/recordActivity.js";
import { requireAdmin } from "../admin/shared/requireAdmin.js";
import { pagination, searchFilter } from "../admin/shared/listQuery.js";
import { notifyProvider } from "../shared/notifications/AccountNotification.js";
import { validateFields } from "../shared/profileSections/validateFields.js";
import { UserBooking } from "../user/bookings/models/UserBooking.js";
import { notify as notifyCustomer } from "../user/notifications/services/notify.js";
import { findPage, pageParams, toObjectId } from "../user/shared/paginate.js";
import { googleConfigured, googleSummary, isGoogleUrl, isPlaceId, placeIdFromUrl, searchPlaces } from "./google.js";
import { CustomerReview, GoogleBusinessLink, REPORT_REASONS, REVIEW_STATUSES, ReviewReport, SERVICE_CATEGORIES } from "./models.js";

// PlumberFinder reviews (customers → companies/freelancers) and each plumber's Google Business Profile link.

const PAGE_SIZE = 10;
const DAILY_LIMIT = 5;           // reviews one customer can write in 24 hours
const HOLD_AFTER_REPORTS = 3;    // reports from different people that hold a review for moderation
const HOLD_WORDS = /\b(viagra|casino|crypto|bitcoin|loan offer|click here|whatsapp me|telegram)\b/i;
// /plumber/<id> redirects to a company's /company/<slug> page.
const profilePath = (_type, id) => `/plumber/${id}#reviews`;

const reviewFields = {
  rating: { type: "number", integer: true, min: 1, max: 5, required: true },
  title: { type: "string", max: 120, required: true },
  body: { type: "text", max: 3000, required: true },
  serviceCategory: { type: "enum", values: SERVICE_CATEGORIES },
  photos: { type: "images", maxItems: 4, max: 1_250_000 },
  bookingReference: { type: "string", max: 20, uppercase: true },
};

/** Checks a review's text. Returns { error } to refuse it, { hold } to publish after moderation, or {}. */
export function checkContent({ title, body }) {
  if (title !== undefined && title.trim().length < 3) return { error: "Give your review a short title (at least 3 characters)." };
  if (body !== undefined && body.trim().length < 20) return { error: "Tell other customers a little more (at least 20 characters)." };
  const text = `${title ?? ""} ${body ?? ""}`;
  if ((text.match(/https?:\/\/|www\./gi) ?? []).length > 0) return { hold: "Contains a link" };
  if (HOLD_WORDS.test(text)) return { hold: "Possible spam words" };
  if (/(.)\1{9,}/.test(text)) return { hold: "Repeated characters" };
  return {};
}

/** PlumberFinder rating for one plumber: average and count of published reviews, and how many of each star. */
export async function reviewSummary(providerType, providerId) {
  const rows = await CustomerReview.aggregate([{ $match: { providerType, providerId: String(providerId), status: "published" } }, { $group: { _id: "$rating", count: { $sum: 1 } } }]);
  const distribution = Object.fromEntries([1, 2, 3, 4, 5].map((star) => [star, rows.find((row) => row._id === star)?.count ?? 0]));
  const count = rows.reduce((sum, row) => sum + row.count, 0);
  const average = count ? Math.round((rows.reduce((sum, row) => sum + row._id * row.count, 0) / count) * 10) / 10 : 0;
  return { average, count, distribution };
}

/** Ratings for many plumbers at once (directory cards): Map(account id → { rating, reviewCount }). */
export async function ratingsByAccount(providerType, accounts) {
  const rows = await CustomerReview.aggregate([{ $match: { providerType, providerAccount: { $in: accounts }, status: "published" } }, { $group: { _id: "$providerAccount", rating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }]);
  return new Map(rows.map((row) => [String(row._id), { rating: Math.round(row.rating * 10) / 10, reviewCount: row.reviewCount }]));
}

/** Latest published reviews in the shape the profile page has always used. */
export async function latestReviews(providerType, providerId, limit = 10) {
  const items = await CustomerReview.find({ providerType, providerId: String(providerId), status: "published" }).sort({ createdAt: -1 }).limit(limit).lean();
  return items.map((item) => ({ _id: item._id, customer: item.userName, rating: item.rating, title: item.title, review: item.body, createdAt: item.createdAt }));
}

/** A review as the public sees it (the customer's last name shortened). */
function present(review, auth) {
  const parts = (review.userName ?? "Customer").trim().split(/\s+/);
  const shortName = parts.length > 1 ? `${parts[0]} ${parts.at(-1)[0]}.` : parts[0];
  return {
    _id: review._id, source: "plumberfinder", rating: review.rating, title: review.title, body: review.body, serviceCategory: review.serviceCategory,
    photos: review.photos ?? [], verified: review.verified, createdAt: review.createdAt, edited: review.edited, editedAt: review.editedAt,
    author: { name: shortName }, reply: review.reply?.body ? review.reply : null,
    isMine: Boolean(auth && auth.accountType === "user" && String(review.user) === String(auth.sub)),
  };
}

const sorts = { newest: { createdAt: -1 }, highest: { rating: -1, createdAt: -1 }, lowest: { rating: 1, createdAt: -1 } };
const optionalAuth = (req) => {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
  if (!token) return null;
  try { return verifyAccessToken(token); } catch { return null; }
};
const findProvider = async (req, res, next) => {
  try {
    req.provider = ["company", "freelancer"].includes(req.params.type) ? await resolveProvider(req.params.type, req.params.id) : null;
    if (!req.provider) return res.status(404).json({ message: "That plumber is not available." });
    next();
  } catch (error) { next(error); }
};
const googleLinkFor = (providerType, account) => (account ? GoogleBusinessLink.findOne({ providerType, providerAccount: account }) : null);

// ---------- Public + customers: /api/reviews ----------
export const reviewsRouter = Router();

// GET /mine/all?limit=&cursor= — (before the /:type/:id routes) the customer's own reviews (all statuses), newest first.
reviewsRouter.get("/mine/all", requireAuth("user"), async (req, res, next) => {
  try {
    const { data, nextCursor } = await findPage(CustomerReview, { user: toObjectId(req.auth.sub) }, pageParams(req.query));
    res.json({ data: data.map((item) => ({ ...present(item, req.auth), status: item.status, providerType: item.providerType, providerId: item.providerId, providerName: item.providerName })), nextCursor });
  } catch (error) { next(error); }
});

// GET /:type/:id?sort=newest|highest|lowest&rating=1-5&page= — PlumberFinder reviews and rating.
reviewsRouter.get("/:type/:id", findProvider, async (req, res, next) => {
  try {
    const auth = optionalAuth(req);
    const { type, id } = req.params;
    const rating = Number(req.query.rating);
    const filter = { providerType: type, providerId: id, status: "published", ...([1, 2, 3, 4, 5].includes(rating) ? { rating } : {}) };
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const [summary, items, total, mine] = await Promise.all([
      reviewSummary(type, id),
      CustomerReview.find(filter).sort(sorts[req.query.sort] ?? sorts.newest).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
      CustomerReview.countDocuments(filter),
      auth?.accountType === "user" ? CustomerReview.findOne({ providerType: type, providerId: id, user: auth.sub }).lean() : null,
    ]);
    res.json({
      data: items.map((item) => present(item, auth)), page, limit: PAGE_SIZE, total, summary,
      mine: mine ? { ...present(mine, auth), status: mine.status, bookingReference: mine.bookingReference } : null,
      canReview: auth?.accountType === "user", categories: SERVICE_CATEGORIES,
    });
  } catch (error) { next(error); }
});

// GET /:type/:id/google — the plumber's Google rating and reviews (when connected), or their Google links.
reviewsRouter.get("/:type/:id/google", findProvider, async (req, res, next) => {
  try {
    const link = await googleLinkFor(req.params.type, req.provider.account);
    res.json({ data: await googleSummary(link) });
  } catch (error) { next(error); }
});

/** Finds the customer's booking with this plumber for a booking reference. */
async function bookingFor(reference, user, type, id) {
  if (!reference) return { booking: null };
  const booking = await UserBooking.findOne({ reference: reference.toUpperCase(), user, providerType: type, providerId: id }).select("_id reference status").lean();
  if (!booking) return { error: `No booking ${reference} with this plumber was found on your account.` };
  return { booking };
}

// POST /:type/:id — a customer reviews a plumber.
reviewsRouter.post("/:type/:id", requireAuth("user"), findProvider, async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { values, errors } = validateFields(reviewFields, req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: "Please check your review.", errors });
    const content = checkContent(values);
    if (content.error) return res.status(400).json({ message: content.error });
    const user = req.auth.sub;
    if (await CustomerReview.exists({ providerType: type, providerId: id, user })) return res.status(409).json({ message: "You've already reviewed this plumber — edit your review instead." });
    if (await CustomerReview.countDocuments({ user, createdAt: { $gt: new Date(Date.now() - 864e5) } }) >= DAILY_LIMIT) return res.status(429).json({ message: "You've written several reviews today. Please try again tomorrow." });
    if (await CustomerReview.exists({ user, body: values.body.trim() })) return res.status(409).json({ message: "You've posted this exact review before. Please write about this plumber." });
    const { booking, error } = await bookingFor(values.bookingReference, user, type, id);
    if (error) return res.status(400).json({ message: error, errors: { bookingReference: error } });
    if (booking && await CustomerReview.exists({ booking: booking._id })) return res.status(409).json({ message: "That booking already has a review." });
    const account = await User.findById(user).select("name").lean();
    let review;
    try {
      review = await CustomerReview.create({
        providerType: type, providerId: id, providerAccount: req.provider.account, providerName: req.provider.name ?? req.body?.providerName,
        user, userName: account?.name ?? "Customer", ...values, photos: values.photos?.length ? values.photos : undefined,
        booking: booking?._id ?? null, bookingReference: booking?.reference, verified: booking?.status === "completed",
        status: content.hold ? "pending" : "published", ...(content.hold ? { moderation: { reason: content.hold, by: "system", at: new Date() } } : {}),
      });
    } catch (dup) {
      if (dup?.code === 11000) return res.status(409).json({ message: "You've already reviewed this plumber." });
      throw dup;
    }
    if (req.provider.account && review.status === "published") {
      const link = type === "company" ? "/company-dashboard/business-profile/reviews" : "/freelancer/business-profile/reviews";
      await notifyProvider(type, req.provider.account, { type: "system", title: `New ${review.rating}★ review`, message: `${review.userName} reviewed you: “${review.title}”`, link });
    }
    res.status(201).json({
      message: review.status === "pending" ? "Thanks! Your review will appear after a quick check." : "Thanks! Your review is live.",
      data: { ...present(review.toObject(), req.auth), status: review.status },
    });
  } catch (error) { next(error); }
});

/** The signed-in customer's own review. */
const ownReview = async (req, res, next) => {
  try {
    req.review = mongoose.isValidObjectId(req.params.reviewId) ? await CustomerReview.findOne({ _id: req.params.reviewId, user: req.auth.sub }) : null;
    if (!req.review) return res.status(404).json({ message: "Review not found." });
    next();
  } catch (error) { next(error); }
};

// PATCH /item/:reviewId — the customer edits their review (rating, title, text, category, photos).
reviewsRouter.patch("/item/:reviewId", requireAuth("user"), ownReview, async (req, res, next) => {
  try {
    const { review } = req;
    if (review.status === "hidden") return res.status(409).json({ message: "This review was removed by our moderators and can't be edited." });
    const { bookingReference: _ignore, ...fields } = reviewFields;
    const { values, errors } = validateFields(fields, req.body, { partial: true });
    if (Object.keys(errors).length) return res.status(400).json({ message: "Please check your review.", errors });
    const content = checkContent(values);
    if (content.error) return res.status(400).json({ message: content.error });
    Object.assign(review, values, { edited: true, editedAt: new Date() });
    if (values.photos && !values.photos.length) review.photos = undefined;
    if (content.hold) Object.assign(review, { status: "pending", moderation: { reason: content.hold, by: "system", at: new Date() } });
    await review.save();
    res.json({ message: review.status === "pending" ? "Saved. Your changes will appear after a quick check." : "Review updated.", data: { ...present(review.toObject(), req.auth), status: review.status } });
  } catch (error) { next(error); }
});

// DELETE /item/:reviewId — the customer deletes their review (it no longer counts).
reviewsRouter.delete("/item/:reviewId", requireAuth("user"), ownReview, async (req, res, next) => {
  try {
    await Promise.all([req.review.deleteOne(), ReviewReport.deleteMany({ review: req.review._id })]);
    res.json({ message: "Review deleted." });
  } catch (error) { next(error); }
});

/** Anyone signed in (customer, company, freelancer) can report a review once; enough reports hold it for moderation. */
async function report(req, res, review, reporter) {
  const reason = REPORT_REASONS.includes(req.body?.reason) ? req.body.reason : null;
  if (!reason) return res.status(400).json({ message: "Choose why you're reporting this review." });
  if (reporter.type === "user" && String(review.user) === String(reporter.id)) return res.status(400).json({ message: "You can't report your own review." });
  try {
    await ReviewReport.create({ review: review._id, reporter, reason, details: typeof req.body?.details === "string" ? req.body.details.trim().slice(0, 500) : undefined });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "You've already reported this review." });
    throw error;
  }
  const updated = await CustomerReview.findByIdAndUpdate(review._id, { $inc: { reportCount: 1 } }, { new: true });
  if (updated.reportCount >= HOLD_AFTER_REPORTS && updated.status === "published") {
    Object.assign(updated, { status: "pending", moderation: { reason: `Reported ${updated.reportCount} times`, by: "system", at: new Date() } });
    await updated.save();
  }
  return res.status(201).json({ message: "Thanks — our team will look at this review." });
}

// POST /item/:reviewId/report { reason, details }
reviewsRouter.post("/item/:reviewId/report", async (req, res, next) => {
  try {
    const auth = optionalAuth(req);
    if (!auth || !["user", "company", "freelancer"].includes(auth.accountType)) return res.status(401).json({ message: "Please log in to report a review." });
    const review = mongoose.isValidObjectId(req.params.reviewId) ? await CustomerReview.findOne({ _id: req.params.reviewId, status: "published" }) : null;
    if (!review) return res.status(404).json({ message: "Review not found." });
    return report(req, res, review, { type: auth.accountType, id: auth.sub });
  } catch (error) { next(error); }
});

// ---------- Plumbers: /api/companies/reviews, /api/freelancers/reviews ----------
/** The company's/freelancer's review inbox: every review (with status), replies, reports, and Google settings. */
export function createProviderReviewsRouter(providerType) {
  const router = Router();
  router.use(requireAuth(providerType));
  const mine = (req) => ({ providerType, providerAccount: new mongoose.Types.ObjectId(String(req.auth.sub)) });
  const listingId = async (req) => (await CustomerReview.findOne(mine(req)).select("providerId").lean())?.providerId;
  const findMine = async (req, res, next) => {
    try {
      req.review = mongoose.isValidObjectId(req.params.id) ? await CustomerReview.findOne({ ...mine(req), _id: req.params.id }) : null;
      if (!req.review) return res.status(404).json({ message: "Review not found." });
      next();
    } catch (error) { next(error); }
  };

  // GET /?search=&sort=&rating=&status=&page=
  router.get("/", async (req, res, next) => {
    try {
      const rating = Number(req.query.rating);
      const status = REVIEW_STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
      const filter = { ...mine(req), ...status, ...([1, 2, 3, 4, 5].includes(rating) ? { rating } : {}), ...searchFilter(req.query.search, ["title", "body", "userName", "serviceCategory"]) };
      const { page, limit, skip } = pagination(req.query);
      const [items, total, grouped, statusCounts, id] = await Promise.all([
        CustomerReview.find(filter).sort(sorts[req.query.sort] ?? sorts.newest).skip(skip).limit(limit).lean(),
        CustomerReview.countDocuments(filter),
        CustomerReview.aggregate([{ $match: { ...mine(req), status: "published" } }, { $group: { _id: "$rating", count: { $sum: 1 } } }]),
        CustomerReview.aggregate([{ $match: mine(req) }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
        listingId(req),
      ]);
      const count = grouped.reduce((sum, row) => sum + row.count, 0);
      const summary = {
        average: count ? Math.round((grouped.reduce((sum, row) => sum + row._id * row.count, 0) / count) * 10) / 10 : 0, count,
        distribution: Object.fromEntries([1, 2, 3, 4, 5].map((star) => [star, grouped.find((row) => row._id === star)?.count ?? 0])),
        byStatus: Object.fromEntries(REVIEW_STATUSES.map((name) => [name, statusCounts.find((row) => row._id === name)?.count ?? 0])),
        unanswered: await CustomerReview.countDocuments({ ...mine(req), status: "published", "reply.body": { $exists: false } }),
      };
      const reports = await ReviewReport.aggregate([{ $match: { review: { $in: items.map((item) => item._id) } } }, { $group: { _id: "$review", reasons: { $addToSet: "$reason" } } }]);
      const reasons = new Map(reports.map((row) => [String(row._id), row.reasons]));
      res.json({
        data: items.map((item) => ({ ...present(item, null), author: { name: item.userName }, status: item.status, moderation: item.moderation, reportCount: item.reportCount, reportReasons: reasons.get(String(item._id)) ?? [], bookingReference: item.bookingReference })),
        page, limit, total, summary, listingId: id ?? null,
      });
    } catch (error) { next(error); }
  });

  // PUT /:id/reply { body } — a public reply under the review (the review itself can't be changed).
  router.put("/:id/reply", findMine, async (req, res, next) => {
    try {
      const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
      if (body.length < 2) return res.status(400).json({ message: "Write a reply first." });
      if (body.length > 1500) return res.status(400).json({ message: "Replies can be up to 1500 characters." });
      const first = !req.review.reply?.body;
      req.review.reply = { body, createdAt: req.review.reply?.createdAt ?? new Date(), updatedAt: new Date() };
      await req.review.save();
      if (first) await notifyCustomer(req.review.user, { type: "system", title: `${req.review.providerName ?? "The plumber"} replied to your review`, message: body.length > 140 ? `${body.slice(0, 137)}…` : body, link: profilePath(providerType, req.review.providerId) });
      res.json({ message: first ? "Reply posted." : "Reply updated.", data: req.review.reply });
    } catch (error) { next(error); }
  });

  router.delete("/:id/reply", findMine, async (req, res, next) => {
    try {
      req.review.reply = undefined;
      await req.review.save();
      res.json({ message: "Reply deleted." });
    } catch (error) { next(error); }
  });

  // POST /:id/report { reason, details } — ask moderators to check a review.
  router.post("/:id/report", findMine, async (req, res, next) => {
    try { return report(req, res, req.review, { type: providerType, id: req.auth.sub }); } catch (error) { next(error); }
  });

  // Google Business Profile: GET /google · PUT /google { profileUrl, placeId } · POST /google/search { query } · POST /google/refresh
  const link = (req) => GoogleBusinessLink.findOne({ providerType, providerAccount: req.auth.sub });
  router.get("/google", async (req, res, next) => {
    try { res.json({ data: { ...(await googleSummary(await link(req))), apiConfigured: googleConfigured() } }); } catch (error) { next(error); }
  });
  router.put("/google", async (req, res, next) => {
    try {
      const profileUrl = typeof req.body?.profileUrl === "string" ? req.body.profileUrl.trim() : "";
      let placeId = typeof req.body?.placeId === "string" ? req.body.placeId.trim() : "";
      if (profileUrl && !isGoogleUrl(profileUrl)) return res.status(400).json({ message: "Use your Google Business Profile or Google Maps link (https://…google.com/… or https://maps.app.goo.gl/…).", errors: { profileUrl: "must be a Google link" } });
      if (!placeId && profileUrl) placeId = placeIdFromUrl(profileUrl) ?? "";
      if (placeId && !isPlaceId(placeId)) return res.status(400).json({ message: "That doesn't look like a Google Place ID (e.g. ChIJN1t_tDeuEmsRUsoyG83frY4).", errors: { placeId: "is not a Place ID" } });
      if (!profileUrl && !placeId) {
        await GoogleBusinessLink.deleteOne({ providerType, providerAccount: req.auth.sub });
        return res.json({ message: "Google Business Profile removed.", data: { connected: false, apiConfigured: googleConfigured() } });
      }
      const doc = await GoogleBusinessLink.findOneAndUpdate({ providerType, providerAccount: req.auth.sub }, { $set: { profileUrl: profileUrl || undefined, placeId: placeId || undefined }, $unset: { cache: 1, lastError: 1 } }, { upsert: true, new: true });
      res.json({ message: "Google Business Profile saved.", data: { ...(await googleSummary(doc, { refresh: true })), apiConfigured: googleConfigured() } });
    } catch (error) { next(error); }
  });
  router.post("/google/search", async (req, res, next) => {
    try {
      if (!googleConfigured()) return res.status(503).json({ message: "Searching Google needs the site's Google Places API key. You can paste your Place ID instead." });
      const query = typeof req.body?.query === "string" ? req.body.query.trim().slice(0, 200) : "";
      if (query.length < 3) return res.status(400).json({ message: "Type your business name and city." });
      res.json({ data: await searchPlaces(query) });
    } catch (error) { res.status(502).json({ message: `Google search failed: ${error.message}` }); }
  });
  router.post("/google/refresh", async (req, res, next) => {
    try { res.json({ data: { ...(await googleSummary(await link(req), { refresh: true })), apiConfigured: googleConfigured() } }); } catch (error) { next(error); }
  });
  return router;
}

// ---------- Admins: /api/admin/reviews ----------
export const adminReviewsRouter = Router();
adminReviewsRouter.use(requireAdmin);

// GET /?status=pending|published|hidden|reported&search=&page= — the moderation queue.
adminReviewsRouter.get("/", async (req, res, next) => {
  try {
    const status = REVIEW_STATUSES.includes(req.query.status) ? { status: req.query.status } : req.query.status === "reported" ? { reportCount: { $gt: 0 } } : {};
    const filter = { ...status, ...searchFilter(req.query.search, ["title", "body", "userName", "providerName"]) };
    const { page, limit, skip } = pagination(req.query);
    const [items, total, counts] = await Promise.all([
      CustomerReview.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate("user", "name email").lean(),
      CustomerReview.countDocuments(filter),
      CustomerReview.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    const reports = await ReviewReport.find({ review: { $in: items.map((item) => item._id) } }).sort({ createdAt: -1 }).lean();
    res.json({
      data: items.map((item) => ({ ...item, reports: reports.filter((r) => String(r.review) === String(item._id)).map((r) => ({ reason: r.reason, details: r.details, by: r.reporter.type, at: r.createdAt })) })),
      page, limit, total,
      counts: { ...Object.fromEntries(REVIEW_STATUSES.map((name) => [name, counts.find((row) => row._id === name)?.count ?? 0])), reported: await CustomerReview.countDocuments({ reportCount: { $gt: 0 } }) },
    });
  } catch (error) { next(error); }
});

// PATCH /:id { status: published|hidden, reason? } — publish a held review, or hide one that breaks the rules.
adminReviewsRouter.patch("/:id", async (req, res, next) => {
  try {
    const status = ["published", "hidden"].includes(req.body?.status) ? req.body.status : null;
    if (!status) return res.status(400).json({ message: "status must be published or hidden." });
    const review = mongoose.isValidObjectId(req.params.id) ? await CustomerReview.findById(req.params.id) : null;
    if (!review) return res.status(404).json({ message: "Review not found." });
    review.status = status;
    review.moderation = { reason: typeof req.body?.reason === "string" ? req.body.reason.slice(0, 300) : status === "published" ? "Approved" : "Removed by moderator", by: "admin", at: new Date() };
    await review.save();
    await ReviewReport.updateMany({ review: review._id }, { $set: { resolved: true } });
    res.json({ message: status === "published" ? "Review published." : "Review hidden.", data: review });
  } catch (error) { next(error); }
});
