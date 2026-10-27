import mongoose from "mongoose";
import { Admin } from "../../auth/admin/models/Admin.js";
import { Company } from "../../auth/company/models/Company.js";
import { Freelancer } from "../../auth/freelancer/models/Freelancer.js";
import { User } from "../../auth/user/models/User.js";
import { ProfileActivity } from "../../activity/ProfileActivity.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { UserBooking } from "../../user/bookings/models/UserBooking.js";
import { pagination, searchFilter } from "../shared/listQuery.js";

// Admin view of every plumber's activity: who visited, read, compared, saved, contacted, and booked them.

const zero = () => ({ profileViews: 0, visitors: 0, projectViews: 0, blogReads: 0, compareAdds: 0, saves: 0, contactClicks: 0, shares: 0, bookings: 0, customers: 0, repeatCustomers: 0, pendingBookings: 0, acceptedBookings: 0, declinedBookings: 0, cancelledBookings: 0, lastActivity: null });
const eventField = { profile_view: "profileViews", project_view: "projectViews", blog_read: "blogReads", compare_add: "compareAdds", save: "saves", call_click: "contactClicks", email_click: "contactClicks", website_click: "contactClicks", share: "shares" };
const latest = (a, b) => (!a ? b : !b ? a : a > b ? a : b);
const profileUrl = (type, id, slug) => (type === "company" && slug ? `/company/${slug}` : `/plumber/${id}`);

/** Every count for the plumbers matching `match` (e.g. one plumber), keyed "type:id". */
async function buildRows(match = {}) {
  const [events, visitors, bookings, customers] = await Promise.all([
    ProfileActivity.aggregate([{ $match: match }, { $group: { _id: { t: "$providerType", id: "$providerId", e: "$event" }, count: { $sum: 1 }, name: { $last: "$providerName" }, last: { $max: "$createdAt" } } }]),
    ProfileActivity.aggregate([{ $match: { ...match, event: "profile_view" } }, { $group: { _id: { t: "$providerType", id: "$providerId", a: { $concat: ["$actor.type", ":", "$actor.id"] } } } }, { $group: { _id: { t: "$_id.t", id: "$_id.id" }, visitors: { $sum: 1 } } }]),
    UserBooking.aggregate([{ $match: match }, { $group: {
      _id: { t: "$providerType", id: "$providerId" }, bookings: { $sum: 1 }, name: { $last: "$providerName" }, last: { $max: "$createdAt" },
      pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
      accepted: { $sum: { $cond: [{ $in: ["$status", ["scheduled", "completed"]] }, 1, 0] } },
      declined: { $sum: { $cond: [{ $eq: ["$status", "declined"] }, 1, 0] } },
      cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
    } }]),
    // Customers per plumber, and how many booked more than once.
    UserBooking.aggregate([{ $match: match }, { $group: { _id: { t: "$providerType", id: "$providerId", u: "$user" }, n: { $sum: 1 } } }, { $group: { _id: { t: "$_id.t", id: "$_id.id" }, customers: { $sum: 1 }, repeat: { $sum: { $cond: [{ $gt: ["$n", 1] }, 1, 0] } } } }]),
  ]);
  const rows = new Map();
  const row = (t, id) => { const key = `${t}:${id}`; if (!rows.has(key)) rows.set(key, { providerType: t, providerId: id, name: null, ...zero() }); return rows.get(key); };
  for (const e of events) {
    const r = row(e._id.t, e._id.id);
    const field = eventField[e._id.e]; // "booking" events are counted from the bookings themselves
    if (field) r[field] += e.count;
    r.name ??= e.name;
    r.lastActivity = latest(r.lastActivity, e.last);
  }
  for (const v of visitors) row(v._id.t, v._id.id).visitors = v.visitors;
  for (const b of bookings) { const r = row(b._id.t, b._id.id); Object.assign(r, { bookings: b.bookings, pendingBookings: b.pending, acceptedBookings: b.accepted, declinedBookings: b.declined, cancelledBookings: b.cancelled }); r.name ??= b.name; r.lastActivity = latest(r.lastActivity, b.last); }
  for (const c of customers) Object.assign(row(c._id.t, c._id.id), { customers: c.customers, repeatCustomers: c.repeat });
  return rows;
}

/** Published listings' names, places, and links (sample plumbers have none: their name comes from activity). */
async function listingInfo(filter = {}) {
  const [companies, freelancers] = await Promise.all([
    filter.type === "freelancer" ? [] : CompanyListing.find({ isPublished: true, ...(filter.id ? { _id: filter.id } : {}) }).select("companyName slug city state").lean(),
    filter.type === "company" ? [] : FreelancerListing.find({ isPublished: true, ...(filter.id ? { _id: filter.id } : {}) }).select("displayName city state").lean(),
  ]);
  return [
    ...companies.map((l) => ({ providerType: "company", providerId: String(l._id), name: l.companyName, location: [l.city, l.state].filter(Boolean).join(", "), url: profileUrl("company", l._id, l.slug) })),
    ...freelancers.map((l) => ({ providerType: "freelancer", providerId: String(l._id), name: l.displayName, location: [l.city, l.state].filter(Boolean).join(", "), url: profileUrl("freelancer", l._id) })),
  ];
}

/** Names for activity actors: customers, companies, freelancers, admins; guests stay "Guest". */
async function actorNames(actors) {
  const ids = (type) => [...new Set(actors.filter((a) => a.type === type && mongoose.isValidObjectId(a.id)).map((a) => a.id))];
  const [users, companies, freelancers, admins] = await Promise.all([
    User.find({ _id: { $in: ids("user") } }).select("name email").lean(),
    Company.find({ _id: { $in: ids("company") } }).select("companyName email").lean(),
    Freelancer.find({ _id: { $in: ids("freelancer") } }).select("name email").lean(),
    Admin.find({ _id: { $in: ids("admin") } }).select("name email").lean(),
  ]);
  const names = new Map([
    ...users.map((u) => [`user:${u._id}`, { name: u.name, email: u.email }]),
    ...companies.map((c) => [`company:${c._id}`, { name: c.companyName, email: c.email }]),
    ...freelancers.map((f) => [`freelancer:${f._id}`, { name: f.name, email: f.email }]),
    ...admins.map((a) => [`admin:${a._id}`, { name: a.name, email: a.email }]),
  ]);
  return (actor) => (actor.type === "guest" ? { name: "Guest visitor", email: null, guestId: actor.id.slice(0, 8) } : names.get(`${actor.type}:${actor.id}`) ?? { name: "Deleted account", email: null });
}

const presentActivity = (items, nameOf) => items.map((item) => ({
  _id: item._id, event: item.event, createdAt: item.createdAt, providerType: item.providerType, providerId: item.providerId, providerName: item.providerName, target: item.target,
  actor: { type: item.actor.type, ...nameOf(item.actor) },
}));

/** GET /api/admin/activity/providers?type=&search=&sort=views|visitors|bookings|customers|recent&page= */
export async function listProviders(req, res, next) {
  try {
    const type = ["company", "freelancer"].includes(req.query.type) ? req.query.type : null;
    const [rows, listings] = await Promise.all([buildRows(type ? { providerType: type } : {}), listingInfo({ type })]);
    for (const listing of listings) {
      const key = `${listing.providerType}:${listing.providerId}`;
      rows.set(key, { ...(rows.get(key) ?? { ...zero() }), ...listing });
    }
    let list = [...rows.values()].map((r) => ({ ...r, name: r.name ?? `Sample plumber #${r.providerId}`, url: r.url ?? profileUrl(r.providerType, r.providerId), sample: !r.location && /^\d+$/.test(r.providerId) }));
    const search = searchFilter(req.query.search, ["name"]).$or?.[0]?.name;
    if (search) list = list.filter((r) => search.test(r.name));
    const sorters = { views: "profileViews", visitors: "visitors", bookings: "bookings", customers: "customers" };
    const field = sorters[req.query.sort];
    list.sort(field ? (a, b) => b[field] - a[field] : (a, b) => String(b.lastActivity ?? "").localeCompare(String(a.lastActivity ?? "")));
    const totals = list.reduce((sum, r) => { for (const k of ["profileViews", "visitors", "projectViews", "blogReads", "compareAdds", "saves", "contactClicks", "bookings", "customers"]) sum[k] = (sum[k] ?? 0) + r[k]; return sum; }, { plumbers: list.length });
    const { page, limit, skip } = pagination(req.query);
    res.json({ data: list.slice(skip, skip + limit), page, limit, total: list.length, totals });
  } catch (error) { next(error); }
}

/** GET /api/admin/activity/providers/:type/:id — one plumber: totals, daily visits/bookings, customers, bookings, activity timeline. */
export async function getProvider(req, res, next) {
  try {
    const { type, id } = req.params;
    if (!["company", "freelancer"].includes(type) || !/^[A-Za-z0-9]{1,64}$/.test(id)) return res.status(404).json({ message: "Plumber not found." });
    const match = { providerType: type, providerId: id };
    const since = new Date(Date.now() - 29 * 864e5);
    since.setUTCHours(0, 0, 0, 0);
    const day = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    const [rows, listings, dailyViews, dailyBookings, customers, bookings, activity] = await Promise.all([
      buildRows(match),
      mongoose.isValidObjectId(id) ? listingInfo({ type, id }) : [],
      ProfileActivity.aggregate([{ $match: { ...match, event: "profile_view", createdAt: { $gte: since } } }, { $group: { _id: day, count: { $sum: 1 } } }]),
      UserBooking.aggregate([{ $match: { ...match, createdAt: { $gte: since } } }, { $group: { _id: day, count: { $sum: 1 } } }]),
      UserBooking.aggregate([{ $match: match }, { $sort: { createdAt: 1 } }, { $group: { _id: "$user", bookings: { $sum: 1 }, first: { $first: "$createdAt" }, last: { $last: "$createdAt" }, name: { $last: "$customerName" }, email: { $last: "$customerEmail" }, services: { $addToSet: "$service" }, statuses: { $push: "$status" } } }, { $sort: { bookings: -1, last: -1 } }, { $limit: 200 }]),
      UserBooking.find(match).sort({ createdAt: -1 }).limit(50).select("reference customerName customerEmail service status scheduledDate timeSlot createdAt responseNote").lean(),
      ProfileActivity.find(match).sort({ createdAt: -1 }).limit(150).lean(),
    ]);
    const base = rows.get(`${type}:${id}`) ?? { providerType: type, providerId: id, ...zero() };
    const info = listings[0] ?? { name: base.name ?? `Sample plumber #${id}`, url: profileUrl(type, id), location: "" };
    if (!listings[0] && !rows.size) return res.status(404).json({ message: "No record of this plumber." });
    // The last 30 days, one entry per day (zero when nothing happened).
    const views = new Map(dailyViews.map((d) => [d._id, d.count]));
    const booked = new Map(dailyBookings.map((d) => [d._id, d.count]));
    const daily = Array.from({ length: 30 }, (_, i) => { const date = new Date(since.getTime() + i * 864e5).toISOString().slice(0, 10); return { date, profileViews: views.get(date) ?? 0, bookings: booked.get(date) ?? 0 }; });
    // Current names for customers who booked.
    const users = await User.find({ _id: { $in: customers.map((c) => c._id) } }).select("name email").lean();
    const byId = new Map(users.map((u) => [String(u._id), u]));
    const nameOf = await actorNames(activity.map((a) => a.actor));
    res.json({ data: {
      ...base, ...info, daily,
      // Lists (counts of the same names stay numbers).
      customerList: customers.map((c) => ({ userId: c._id, name: byId.get(String(c._id))?.name ?? c.name ?? "Deleted account", email: byId.get(String(c._id))?.email ?? c.email, bookings: c.bookings, firstBooking: c.first, lastBooking: c.last, services: c.services, accepted: c.statuses.filter((s) => s === "scheduled" || s === "completed").length, declined: c.statuses.filter((s) => s === "declined").length })),
      bookingList: bookings,
      activity: presentActivity(activity, nameOf),
    } });
  } catch (error) { next(error); }
}

/** GET /api/admin/activity/recent?event=&page= — the latest activity across every plumber. */
export async function recentActivity(req, res, next) {
  try {
    const filter = ProfileActivity.schema.path("event").enumValues.includes(req.query.event) ? { event: req.query.event } : {};
    const { page, limit, skip } = pagination({ ...req.query, limit: req.query.limit ?? 50 });
    const [items, total] = await Promise.all([ProfileActivity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), ProfileActivity.countDocuments(filter)]);
    const nameOf = await actorNames(items.map((a) => a.actor));
    res.json({ data: presentActivity(items, nameOf), page, limit, total });
  } catch (error) { next(error); }
}
