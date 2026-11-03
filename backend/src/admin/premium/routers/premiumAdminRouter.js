import { Router } from "express";
import { premiumAdminController as premium } from "../controllers/premiumAdminController.js";
import { requirePremiumAdmin } from "../middleware/premiumAdminAuth.js";
import { validateActivate, validateCancel } from "../middleware/validatePremiumAdmin.js";

// Mounted at /api/admin/premium.
export const premiumAdminRouter = Router();
premiumAdminRouter.use(requirePremiumAdmin);
premiumAdminRouter.get("/", premium.list);
premiumAdminRouter.get("/payments", premium.payments);
premiumAdminRouter.post("/:id/activate", validateActivate, premium.activate);
premiumAdminRouter.post("/:id/cancel", validateCancel, premium.cancel);
