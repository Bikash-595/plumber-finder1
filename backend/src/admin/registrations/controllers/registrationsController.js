import { Company } from "../../../auth/company/models/Company.js";
import { Freelancer } from "../../../auth/freelancer/models/Freelancer.js";
import { User } from "../../../auth/user/models/User.js";
import { registrationsConfig } from "../config/registrationsConfig.js";

/** GET /api/admin/registrations?days=30 — newest customer, company, and freelancer signups together. */
export async function listRegistrations(req, res, next) {
  try {
    const days = Math.min(registrationsConfig.maxDays, Math.max(1, Number.parseInt(req.query.days, 10) || registrationsConfig.defaultDays));
    const since = { createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } };
    const { limit } = registrationsConfig;
    const [users, companies, freelancers] = await Promise.all([
      User.find(since).sort({ createdAt: -1 }).limit(limit).select("name email createdAt").lean(),
      Company.find(since).sort({ createdAt: -1 }).limit(limit).select("companyName email status createdAt").lean(),
      Freelancer.find(since).sort({ createdAt: -1 }).limit(limit).select("name email verificationStatus createdAt").lean(),
    ]);
    const data = [
      ...users.map((u) => ({ _id: u._id, accountType: "user", name: u.name, email: u.email, createdAt: u.createdAt })),
      ...companies.map((c) => ({ _id: c._id, accountType: "company", name: c.companyName, email: c.email, status: c.status, createdAt: c.createdAt })),
      ...freelancers.map((f) => ({ _id: f._id, accountType: "freelancer", name: f.name, email: f.email, status: f.verificationStatus, createdAt: f.createdAt })),
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
    res.json({ data, days });
  } catch (error) { next(error); }
}
