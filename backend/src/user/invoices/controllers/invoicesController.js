import { UserInvoice } from "../models/UserInvoice.js";

export const invoicesController = {
  list: async (req, res, next) => {
    try { res.json({ data: await UserInvoice.find({ user: req.auth.sub }).sort({ createdAt: -1 }) }); } catch (error) { next(error); }
  },
  getOne: async (req, res, next) => {
    try {
      const invoice = await UserInvoice.findOne({ _id: req.params.id, user: req.auth.sub });
      if (!invoice) return res.status(404).json({ message: "Invoice not found." });
      res.json({ data: invoice });
    } catch (error) { next(error); }
  },
};
