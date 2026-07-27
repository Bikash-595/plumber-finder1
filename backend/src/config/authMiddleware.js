import { verifyAccessToken } from "./auth.js";

export function requireAuth(expectedAccountType) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Authentication is required." });
      const payload = verifyAccessToken(token);
      if (expectedAccountType && payload.accountType !== expectedAccountType) {
        return res.status(403).json({ message: "This account type cannot access this resource." });
      }
      req.auth = payload;
      next();
    } catch {
      res.status(401).json({ message: "Your session is invalid or has expired." });
    }
  };
}
