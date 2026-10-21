import { Router } from "express";
import { invoicesController } from "../controllers/invoicesController.js";
import { requireInvoicesAccess } from "../middleware/invoicesAuth.js";

// Mounted at /api/users/invoices (read-only).
export const invoicesRouter = Router();
invoicesRouter.use(requireInvoicesAccess);
invoicesRouter.get("/", invoicesController.list);
invoicesRouter.get("/:id", invoicesController.getOne);
