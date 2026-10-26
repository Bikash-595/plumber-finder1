import crypto from "node:crypto";
import mongoose from "mongoose";

// How many times each blog post was read (views) and by how many different people (readers).
// A view is counted when someone opens a post; the same reader opening it again within 30 minutes
// (a refresh, going back and forth) is the same view. Signed-in readers are counted per account,
// guests per browser (an anonymous id the site keeps), so readers are unique people as far as we can tell.

export const REPEAT_VIEW_AFTER_MS = 30 * 60 * 1000;
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i;

// One row per reader per post.
const blogViewSchema = new mongoose.Schema({
  post: { type: String, required: true },
  viewer: { type: String, required: true }, // "user:<id>", "company:<id>", "freelancer:<id>", "admin:<id>", or "guest:<id>"
  signedIn: { type: Boolean, default: false },
  count: { type: Number, default: 1 },
  lastViewedAt: { type: Date, default: Date.now },
}, { timestamps: true, collection: "blog_views" });
blogViewSchema.index({ post: 1, viewer: 1 }, { unique: true });
export const BlogView = mongoose.model("BlogView", blogViewSchema);

// Running totals per post, so lists can show counts without adding up every view.
const blogPostStatsSchema = new mongoose.Schema({
  post: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 },
  readers: { type: Number, default: 0 },
  signedInReaders: { type: Number, default: 0 },
}, { timestamps: true, collection: "blog_post_stats" });
export const BlogPostStats = mongoose.model("BlogPostStats", blogPostStatsSchema);

/** Who is reading: their account when signed in, otherwise the browser's anonymous id (or, without one, a hash of IP + browser). */
export function viewerOf(req, auth) {
  if (auth) return { viewer: `${auth.accountType}:${auth.sub}`, signedIn: true };
  const visitor = typeof req.body?.visitorId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(req.body.visitorId) ? req.body.visitorId : null;
  if (visitor) return { viewer: `guest:${visitor}`, signedIn: false };
  const fingerprint = crypto.createHash("sha256").update(`${req.ip}|${req.headers["user-agent"] ?? ""}`).digest("hex").slice(0, 24);
  return { viewer: `guest:ip-${fingerprint}`, signedIn: false };
}

export const isBot = (req) => BOT.test(req.headers["user-agent"] ?? "");

/**
 * Counts one view of `post` by `viewer`. Race-safe without locks: a returning reader's view counts only if
 * their last one is over 30 minutes old (one conditional update), and a first-time reader is an insert that the
 * unique index allows only once. Returns { counted, newReader }.
 */
export async function recordView(post, { viewer, signedIn }) {
  const now = new Date();
  const again = await BlogView.updateOne({ post, viewer, lastViewedAt: { $lt: new Date(now.getTime() - REPEAT_VIEW_AFTER_MS) } }, { $set: { lastViewedAt: now }, $inc: { count: 1 } });
  if (again.modifiedCount) {
    await BlogPostStats.updateOne({ post }, { $inc: { views: 1 } }, { upsert: true });
    return { counted: true, newReader: false };
  }
  try {
    await BlogView.create({ post, viewer, signedIn, lastViewedAt: now });
  } catch (error) {
    if (error?.code === 11000) return { counted: false, newReader: false }; // viewed within the last 30 minutes
    throw error;
  }
  await BlogPostStats.updateOne({ post }, { $inc: { views: 1, readers: 1, signedInReaders: signedIn ? 1 : 0 } }, { upsert: true });
  return { counted: true, newReader: true };
}

const empty = { views: 0, readers: 0, signedInReaders: 0 };

/** Totals for many posts at once: Map(post key → { views, readers, signedInReaders }). */
export async function statsFor(keys) {
  const rows = keys.length ? await BlogPostStats.find({ post: { $in: keys } }).select("post views readers signedInReaders").lean() : [];
  const byKey = new Map(rows.map((row) => [row.post, { views: row.views, readers: row.readers, signedInReaders: row.signedInReaders }]));
  return new Map(keys.map((key) => [key, byKey.get(key) ?? empty]));
}

/** Adds `views` and `readers` to posts of one kind ("company", "freelancer", "platform") for public lists. */
export async function withViews(posts, type) {
  const stats = await statsFor(posts.map((post) => `${type}:${post._id ?? post.id}`));
  return posts.map((post) => {
    const { views, readers } = stats.get(`${type}:${post._id ?? post.id}`);
    return { ...post, views, readers };
  });
}
