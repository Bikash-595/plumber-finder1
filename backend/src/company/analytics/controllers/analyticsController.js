import { ProfileActivity } from "../../../activity/ProfileActivity.js";
import { CustomerReview } from "../../../reviews/models/index.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { analyticsConfig as config } from "../config/analyticsConfig.js";
import { listingFor, sideOf } from "../../../shared/business/sides.js";
import { activityTotals, bookingTotals, DAY_MS, money, pctChange, toId } from "../../dashboard/services/metrics.js";

const startOfDay = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

/** The buckets of the timeline: every day (≤ 90 days) or every month (a year). */
function buckets(days, now) {
  if (days <= 90) {
    const first = new Date(startOfDay(now).getTime() - (days - 1) * DAY_MS);
    return { format: "%Y-%m-%d", from: first, keys: Array.from({ length: days }, (_, i) => new Date(first.getTime() + i * DAY_MS).toISOString().slice(0, 10)) };
  }
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  return { format: "%Y-%m", from: first, keys: Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + i, 1)).toISOString().slice(0, 7)) };
}

/**
 * GET /api/companies/analytics?days=7|30|90|365 — the company's traffic, bookings, revenue and reviews for the
 * period, compared with the period before. Everything comes from real records: profile activity, bookings
 * and reviews; nothing is estimated.
 */
export async function getAnalytics(req, res, next) {
  try {
    const days = config.ranges.includes(Number(req.query.days)) ? Number(req.query.days) : config.defaultDays;
    const now = new Date();
    const { type } = sideOf(req);
    const company = toId(req.auth.sub);
    const scope = { providerType: type, providerAccount: company };
    const { format, from, keys } = buckets(days, now);
    const prevFrom = new Date(from.getTime() - (now.getTime() - from.getTime()));
    const listing = await listingFor(type, company);
    const activityScope = listing ? { providerType: type, providerId: String(listing._id) } : null;
    const dateKey = (field) => ({ $dateToString: { format, date: field } });

    const [current, previous, bookingsNow, bookingsPrev, viewsByDay, requestsByDay, completedByDay, topServices, weekdays, reviewRows, statuses] = await Promise.all([
      activityTotals(listing?._id, from, now, type),
      activityTotals(listing?._id, prevFrom, from, type),
      bookingTotals(company, from, now, type),
      bookingTotals(company, prevFrom, from, type),
      activityScope ? ProfileActivity.aggregate([{ $match: { ...activityScope, event: "profile_view", createdAt: { $gte: from } } }, { $group: { _id: dateKey("$createdAt"), count: { $sum: 1 } } }]) : [],
      UserBooking.aggregate([{ $match: { ...scope, createdAt: { $gte: from } } }, { $group: { _id: dateKey("$createdAt"), count: { $sum: 1 } } }]),
      UserBooking.aggregate([{ $match: { ...scope, status: "completed", completedAt: { $gte: from } } }, { $group: { _id: dateKey("$completedAt"), count: { $sum: 1 }, revenue: { $sum: { $multiply: [{ $ifNull: ["$price", 0] }, { $ifNull: ["$quantity", 1] }] } } } }]),
      UserBooking.aggregate([
        { $match: { ...scope, createdAt: { $gte: from } } },
        { $group: { _id: "$service", bookings: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }, revenue: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, { $multiply: [{ $ifNull: ["$price", 0] }, { $ifNull: ["$quantity", 1] }] }, 0] } } } },
        { $sort: { bookings: -1 } }, { $limit: 6 },
      ]),
      UserBooking.aggregate([{ $match: { ...scope, createdAt: { $gte: from } } }, { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }]),
      CustomerReview.aggregate([{ $match: { ...scope, status: "published", createdAt: { $gte: from } } }, { $group: { _id: { $ifNull: ["$source", "directory"] }, count: { $sum: 1 }, average: { $avg: "$rating" } } }]),
      UserBooking.aggregate([{ $match: { ...scope, createdAt: { $gte: from } } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const map = (rows, field = "count") => new Map(rows.map((row) => [row._id, row[field]]));
    const [views, requests, completed, revenue] = [map(viewsByDay), map(requestsByDay), map(completedByDay), map(completedByDay, "revenue")];
    const timeline = keys.map((key) => ({ key, views: views.get(key) ?? 0, bookings: requests.get(key) ?? 0, completed: completed.get(key) ?? 0, revenue: money(revenue.get(key) ?? 0) }));
    const kpi = (value, before) => ({ value, previous: before, change: pctChange(value, before) });
    const conversion = (requestsCount, visitors) => (visitors ? Math.round((requestsCount / visitors) * 1000) / 10 : null);
    const reviewCount = reviewRows.reduce((sum, row) => sum + row.count, 0);

    res.json({
      data: {
        days, from, to: now, granularity: days <= 90 ? "day" : "month", hasListing: Boolean(listing),
        kpis: {
          views: kpi(current.views, previous.views),
          visitors: kpi(current.visitors, previous.visitors),
          contacts: kpi(current.contacts, previous.contacts),
          requests: kpi(bookingsNow.received, bookingsPrev.received),
          completed: kpi(bookingsNow.completed, bookingsPrev.completed),
          revenue: kpi(bookingsNow.revenue, bookingsPrev.revenue),
          avgJobValue: kpi(bookingsNow.completed ? money(bookingsNow.revenue / bookingsNow.completed) : 0, bookingsPrev.completed ? money(bookingsPrev.revenue / bookingsPrev.completed) : 0),
          conversionRate: { value: conversion(bookingsNow.received, current.visitors), previous: conversion(bookingsPrev.received, previous.visitors) },
          acceptanceRate: { value: bookingsNow.acceptanceRate, previous: bookingsPrev.acceptanceRate },
          avgReplyMinutes: { value: bookingsNow.avgReplyMinutes, previous: bookingsPrev.avgReplyMinutes },
        },
        timeline,
        funnel: [
          { key: "visitors", label: "Profile visitors", value: current.visitors },
          { key: "contacts", label: "Called, emailed or visited website", value: current.contacts },
          { key: "requests", label: "Booking requests", value: bookingsNow.received },
          { key: "accepted", label: "Accepted", value: bookingsNow.accepted },
          { key: "completed", label: "Completed jobs", value: bookingsNow.completed },
        ],
        actions: ["profile_view", "call_click", "email_click", "website_click", "share", "save", "compare_add", "project_view", "blog_read"].map((event) => ({ event, count: current.byEvent[event] ?? 0 })),
        topServices: topServices.map((row) => ({ service: row._id, bookings: row.bookings, completed: row.completed, revenue: money(row.revenue) })),
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, index) => ({ label, count: weekdays.find((row) => row._id === index + 1)?.count ?? 0 })),
        statuses: Object.fromEntries(statuses.map((row) => [row._id, row.count])),
        reviews: {
          count: reviewCount,
          average: reviewCount ? Math.round((reviewRows.reduce((sum, row) => sum + row.average * row.count, 0) / reviewCount) * 10) / 10 : null,
          verified: reviewRows.find((row) => row._id === "verified_booking")?.count ?? 0,
          directory: reviewRows.find((row) => row._id === "directory")?.count ?? 0,
        },
      },
    });
  } catch (error) { next(error); }
}
