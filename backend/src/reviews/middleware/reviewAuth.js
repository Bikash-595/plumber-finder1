import { resolveProvider } from "../../activity/recordActivity.js";
import { verifyAccessToken } from "../../auth/shared/services/tokens.js";
import { PROVIDER_TYPES } from "../config/reviewsConfig.js";

/** The signed-in account's token claims, or null — for pages anyone can read. */
export function optionalAuth(req) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
  if (!token) return null;
  try { return verifyAccessToken(token); } catch { return null; }
}

/** Loads the plumber in :type/:id (a live listing or a sample plumber) as req.provider. */
export async function findProvider(req, res, next) {
  try {
    req.provider = PROVIDER_TYPES.includes(req.params.type) ? await resolveProvider(req.params.type, req.params.id) : null;
    if (!req.provider) return res.status(404).json({ message: "That plumber is not available." });
    next();
  } catch (error) { next(error); }
}
