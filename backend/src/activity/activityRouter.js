import { Router } from "express";
import { verifyAccessToken } from "../auth/shared/services/tokens.js";
import { actorOf, isBot, recordActivity, resolveProvider } from "./recordActivity.js";

// Events the site sends from profile pages. Bookings, blog reads, compares, and saves are recorded by the server.
const CLIENT_EVENTS = ["profile_view", "project_view", "call_click", "email_click", "website_click", "share"];

/** Mounted at /api/activity. POST / { providerType, providerId, event, target?, providerName?, visitorId? } — anyone. */
export const activityRouter = Router();
activityRouter.post("/", async (req, res, next) => {
  try {
    const { providerType, providerId, event, target, providerName } = req.body ?? {};
    if (!CLIENT_EVENTS.includes(event)) return res.status(400).json({ message: "Unknown activity." });
    const provider = await resolveProvider(providerType, String(providerId ?? ""));
    if (!provider) return res.status(404).json({ message: "That plumber is not available." });
    let auth = null;
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
    if (token) { try { auth = verifyAccessToken(token); } catch { auth = null; } }
    const cleanTarget = target && typeof target === "object" ? { id: String(target.id ?? "").slice(0, 120) || undefined, title: String(target.title ?? "").slice(0, 200) || undefined } : undefined;
    const stored = isBot(req) ? false : await recordActivity({
      providerType, providerId: String(providerId), providerAccount: provider.account,
      providerName: provider.name ?? (typeof providerName === "string" ? providerName.slice(0, 150) : undefined),
      event, target: cleanTarget, actor: actorOf(req, auth),
    });
    res.status(stored ? 201 : 200).json({ data: { recorded: stored } });
  } catch (error) { next(error); }
});
