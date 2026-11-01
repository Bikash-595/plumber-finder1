import { CompanyOpeningHours } from "../../opening-hours/models/CompanyOpeningHours.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { DAY_MS, toId } from "../../dashboard/services/metrics.js";
import { scheduleConfig as config } from "../config/scheduleConfig.js";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET /api/companies/schedule?from=YYYY-MM-DD&to=YYYY-MM-DD — bookings with a visit date in the range (at most
 * 62 days), plus the company's opening hours. Visit dates are stored as midnight UTC.
 */
export async function getSchedule(req, res, next) {
  try {
    if (!ISO.test(req.query.from ?? "") || !ISO.test(req.query.to ?? "")) return res.status(400).json({ message: "from and to must be dates (YYYY-MM-DD)." });
    const from = new Date(`${req.query.from}T00:00:00Z`);
    const to = new Date(`${req.query.to}T00:00:00Z`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return res.status(400).json({ message: "Choose a valid date range." });
    if ((to - from) / DAY_MS > config.maxDays) return res.status(400).json({ message: `Show at most ${config.maxDays} days at a time.` });
    const company = toId(req.auth.sub);
    const [items, hours] = await Promise.all([
      UserBooking.find({ providerType: "company", providerAccount: company, status: { $in: config.statuses }, scheduledDate: { $gte: from, $lt: new Date(to.getTime() + DAY_MS) } })
        .sort({ scheduledDate: 1, timeSlot: 1 }).limit(500).select("reference customerName service status scheduledDate timeSlot address price quantity").lean(),
      CompanyOpeningHours.findOne({ company }).lean(),
    ]);
    res.json({ data: { from: req.query.from, to: req.query.to, items, hours: hours ? { weekly: hours.weeklyHours ?? [], emergency: hours.emergencyHours ?? null } : null } });
  } catch (error) { next(error); }
}
