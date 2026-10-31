import { countsByStatus, findPage, pageParams, textFilter, toObjectId } from "../../shared/paginate.js";
import { invoicesConfig } from "../config/invoicesConfig.js";
import { UserInvoice } from "../models/UserInvoice.js";

export const invoicesController = {
  // GET /?status=paid&q=INV-…&limit=20&cursor=… — newest first, one page at a time.
  // The first page also carries `summary`: how many invoices and how much money per status (for the wallet and tabs).
  list: async (req, res, next) => {
    try {
      const user = toObjectId(req.auth.sub);
      const filter = {
        user,
        ...(invoicesConfig.statuses.includes(req.query.status) ? { status: req.query.status } : {}),
        ...textFilter(req.query.q, ["number", "items.providerName", "items.name"]),
      };
      const params = pageParams(req.query);
      const [page, groups] = await Promise.all([
        findPage(UserInvoice, filter, params),
        params.cursor ? null : UserInvoice.aggregate([{ $match: { user } }, { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$total" } } }]),
      ]);
      const summary = groups && {
        counts: countsByStatus(groups, invoicesConfig.statuses),
        totals: countsByStatus(groups.map(({ _id, total }) => ({ _id, count: Math.round(total * 100) / 100 })), invoicesConfig.statuses),
      };
      res.json({ ...page, ...(summary ? { summary } : {}) });
    } catch (error) { next(error); }
  },
  getOne: async (req, res, next) => {
    try {
      const invoice = await UserInvoice.findOne({ _id: req.params.id, user: req.auth.sub }).lean();
      if (!invoice) return res.status(404).json({ message: "Invoice not found." });
      res.json({ data: invoice });
    } catch (error) { next(error); }
  },
};
