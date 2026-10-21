import { Router } from "express";
import { faqsController } from "../controllers/faqsController.js";
import { requireFreelancerFaqsAccess } from "../middleware/faqsAuth.js";
import { validateFaqsCreate, validateFaqsUpdate } from "../middleware/validateFaqs.js";

export const faqsRouter = Router();

// Public: FAQs shown on a published freelancer profile (by public listing id).
faqsRouter.get("/public/:listingId", faqsController.listPublic);

// Signed-in freelancer: manage its own FAQs.
faqsRouter.get("/", requireFreelancerFaqsAccess, faqsController.list);
faqsRouter.post("/", requireFreelancerFaqsAccess, validateFaqsCreate, faqsController.create);
faqsRouter.get("/:id", requireFreelancerFaqsAccess, faqsController.getOne);
faqsRouter.put("/:id", requireFreelancerFaqsAccess, validateFaqsUpdate, faqsController.update);
faqsRouter.patch("/:id", requireFreelancerFaqsAccess, validateFaqsUpdate, faqsController.update);
faqsRouter.delete("/:id", requireFreelancerFaqsAccess, faqsController.remove);
