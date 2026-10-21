import { Router } from "express";
import { faqsController } from "../controllers/faqsController.js";
import { requireCompanyFaqsAccess } from "../middleware/faqsAuth.js";
import { validateFaqsCreate, validateFaqsUpdate } from "../middleware/validateFaqs.js";

export const faqsRouter = Router();

// Public: FAQs shown on a published company profile (by public listing id).
faqsRouter.get("/public/:listingId", faqsController.listPublic);

// Signed-in company: manage its own FAQs.
faqsRouter.get("/", requireCompanyFaqsAccess, faqsController.list);
faqsRouter.post("/", requireCompanyFaqsAccess, validateFaqsCreate, faqsController.create);
faqsRouter.get("/:id", requireCompanyFaqsAccess, faqsController.getOne);
faqsRouter.put("/:id", requireCompanyFaqsAccess, validateFaqsUpdate, faqsController.update);
faqsRouter.patch("/:id", requireCompanyFaqsAccess, validateFaqsUpdate, faqsController.update);
faqsRouter.delete("/:id", requireCompanyFaqsAccess, faqsController.remove);
