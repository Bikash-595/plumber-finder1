import crypto from "node:crypto";
import mongoose from "mongoose";
import { CompanyListing } from "../company/listing/models/CompanyListing.js";
import { FreelancerListing } from "../freelancer/listing/models/FreelancerListing.js";
import { DEDUPED_EVENTS, DEDUPE_WINDOW_MS, ProfileActivity } from "./ProfileActivity.js";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i;
export const isBot = (req) => BOT.test(req.headers["user-agent"] ?? "");
// The site's sample plumbers have short numeric ids.
const SAMPLE_ID = /^\d{1,6}$/;

/** The published listing behind a public profile: { name, account } (account null for sample plumbers), or null. */
export async function resolveProvider(providerType, providerId) {
  if (providerType === "company" && SAMPLE_ID.test(providerId)) return { name: null, account: null };
  if (!["company", "freelancer"].includes(providerType) || !mongoose.isValidObjectId(providerId) || String(providerId).length !== 24) return null;
  const listing = providerType === "company"
    ? await CompanyListing.findOne({ _id: providerId, isPublished: true }).select("company companyName").lean()
    : await FreelancerListing.findOne({ _id: providerId, isPublished: true }).select("freelancer displayName").lean();
  return listing ? { name: listing.companyName ?? listing.displayName, account: listing.company ?? listing.freelancer } : null;
}

/** Who did it: their account when signed in, otherwise the browser's anonymous id (or a hash of IP + browser). */
export function actorOf(req, auth) {
  if (auth?.accountType && auth?.sub) return { type: auth.accountType, id: String(auth.sub) };
  const visitor = typeof req.body?.visitorId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(req.body.visitorId) ? req.body.visitorId : null;
  if (visitor) return { type: "guest", id: visitor };
  return { type: "guest", id: `ip-${crypto.createHash("sha256").update(`${req.ip}|${req.headers["user-agent"] ?? ""}`).digest("hex").slice(0, 24)}` };
}

/**
 * Stores one activity. Repeatable events (visits, clicks) count once per person per 30 minutes; a plumber's
 * own visits to their profile aren't counted. Never throws: tracking must not break the page or the booking.
 * Returns true when stored.
 */
export async function recordActivity({ providerType, providerId, providerAccount = null, providerName, event, target, actor }) {
  try {
    if (providerAccount && actor.type === providerType && actor.id === String(providerAccount)) return false;
    const window = Math.floor(Date.now() / DEDUPE_WINDOW_MS);
    const dedupeKey = DEDUPED_EVENTS.includes(event) ? [providerType, providerId, event, target?.id ?? "", actor.type, actor.id, window].join("|") : undefined;
    await ProfileActivity.create({ providerType, providerId: String(providerId), providerAccount, providerName, event, target, actor, ...(dedupeKey ? { dedupeKey } : {}) });
    return true;
  } catch (error) {
    if (error?.code !== 11000) console.error("Activity not recorded:", error.message);
    return false;
  }
}

/**
 * Express middleware for the customer's compare/save routes: after a successful add, records it for the plumber.
 * (Runs when the response is sent, so a rejected or duplicate add isn't counted.)
 */
export const recordAfterSuccess = (event) => (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return;
    const { providerType, providerId, name: providerName } = req.validated ?? {};
    if (!providerType || !providerId) return;
    resolveProvider(providerType, providerId).then((provider) => provider && recordActivity({
      providerType, providerId, providerAccount: provider.account, providerName: provider.name ?? providerName, event,
      actor: { type: req.auth.accountType, id: String(req.auth.sub) },
    })).catch(() => undefined);
  });
  next();
};
