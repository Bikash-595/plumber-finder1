import { currentTokenVersion, sessionChecked } from "../services/sessions.js";
import { verifyAccessToken } from "../services/tokens.js";

/**
 * Requires a valid Bearer token; optionally restricted to one account type ("user", "company", "freelancer").
 * For accounts with revocable sessions (see sessions.js) the token must also be from the current session generation.
 */
export function requireAuth(expectedAccountType) {
  return async (req, res, next) => {
    let payload;
    try {
      const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Authentication is required." });
      payload = verifyAccessToken(token);
    } catch {
      return res.status(401).json({ message: "Your session is invalid or has expired." });
    }
    if (expectedAccountType && payload.accountType !== expectedAccountType) {
      return res.status(403).json({ message: "This account type cannot access this resource." });
    }
    if (sessionChecked(payload.accountType)) {
      try {
        const version = await currentTokenVersion(payload.accountType, payload.sub);
        if (version === null || (payload.tv ?? 0) !== version) return res.status(401).json({ message: "You were signed out. Please log in again." });
      } catch (error) { return next(error); }
    }
    req.auth = payload;
    next();
  }
}
