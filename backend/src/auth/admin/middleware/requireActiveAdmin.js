import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { Admin } from "../models/Admin.js";

const requireAdminToken = requireAuth("admin");

/** Valid admin token AND the admin account still exists and is active (so access can be revoked). */
export function requireActiveAdmin(req, res, next) {
  requireAdminToken(req, res, async () => {
    try {
      const admin = await Admin.exists({ _id: req.auth.sub, isActive: true });
      if (!admin) return res.status(401).json({ message: "Your admin access has been revoked." });
      next();
    } catch (error) { next(error); }
  });
}
