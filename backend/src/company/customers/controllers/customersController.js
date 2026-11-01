import mongoose from "mongoose";
import { CustomerReview } from "../../../reviews/models/index.js";
import { forProvider } from "../../../shared/bookings/bookingWorkflow.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { textFilter } from "../../../user/shared/paginate.js";
import { money, toId } from "../../dashboard/services/metrics.js";
import { customersConfig as config } from "../config/customersConfig.js";

const sorts = { recent: { lastBooked: -1 }, bookings: { bookings: -1, lastBooked: -1 }, spent: { spent: -1, lastBooked: -1 }, name: { name: 1 } };
const spentExpr = { $cond: [{ $eq: ["$status", "completed"] }, { $multiply: [{ $ifNull: ["$price", 0] }, { $ifNull: ["$quantity", 1] }] }, 0] };

/** GET /api/companies/customers?q=&sort=recent|bookings|spent|name&page= — one row per customer, with totals. */
export async function listCustomers(req, res, next) {
  try {
    const scope = { providerType: "company", providerAccount: toId(req.auth.sub) };
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const sort = sorts[req.query.sort] ?? sorts.recent;
    const [result] = await UserBooking.aggregate([
      { $match: { ...scope, ...textFilter(req.query.q, ["customerName", "customerEmail"]) } },
      { $sort: { createdAt: 1 } },
      { $group: {
        _id: "$user", name: { $last: "$customerName" }, bookings: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        active: { $sum: { $cond: [{ $in: ["$status", ["pending", "scheduled", "in_progress", "awaiting_confirmation", "disputed"]] }, 1, 0] } },
        spent: { $sum: spentExpr }, firstBooked: { $first: "$createdAt" }, lastBooked: { $last: "$createdAt" },
        lastService: { $last: "$service" }, accepted: { $max: { $cond: [{ $ifNull: ["$acceptedAt", false] }, 1, 0] } },
        email: { $last: "$customerEmail" }, phone: { $max: { $cond: [{ $ifNull: ["$acceptedAt", false] }, "$phone", null] } }, // from an accepted booking only
      } },
      { $facet: {
        rows: [{ $sort: sort }, { $skip: (page - 1) * config.pageSize }, { $limit: config.pageSize }],
        total: [{ $count: "n" }],
        totals: [{ $group: { _id: null, customers: { $sum: 1 }, repeat: { $sum: { $cond: [{ $gt: ["$bookings", 1] }, 1, 0] } }, spent: { $sum: "$spent" } } }],
      } },
    ]);
    const rows = result.rows.map(({ _id, accepted, email, phone, spent, ...row }) => ({ ...row, id: _id, spent: money(spent), contactVisible: Boolean(accepted), email: accepted ? email : null, phone: accepted ? phone : null }));
    const totals = result.totals[0] ?? { customers: 0, repeat: 0, spent: 0 };
    res.json({ data: rows, page, limit: config.pageSize, total: result.total[0]?.n ?? 0, summary: { customers: totals.customers, repeat: totals.repeat, spent: money(totals.spent), avgPerCustomer: totals.customers ? money(totals.spent / totals.customers) : 0 } });
  } catch (error) { next(error); }
}

/** GET /api/companies/customers/:id — one customer's bookings with the company and their reviews of it. */
export async function getCustomer(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Customer not found." });
    const scope = { providerType: "company", providerAccount: toId(req.auth.sub) };
    const [bookings, reviews] = await Promise.all([
      UserBooking.find({ ...scope, user: req.params.id }).sort({ createdAt: -1 }).limit(100),
      CustomerReview.find({ ...scope, user: req.params.id, status: "published" }).sort({ createdAt: -1 }).select("rating title body source createdAt reply").lean(),
    ]);
    if (!bookings.length) return res.status(404).json({ message: "Customer not found." });
    res.json({ data: { id: req.params.id, name: bookings[0].customerName, bookings: bookings.map(forProvider), reviews } });
  } catch (error) { next(error); }
}
