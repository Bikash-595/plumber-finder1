import { Router } from "express";
import { quotesController as quotes } from "../../../company/quotes/controllers/quotesController.js";
import { validateQuoteCreate, validateQuoteUpdate } from "../../../company/quotes/middleware/validateQuotes.js";
import { requireQuotesAccess } from "../middleware/quotesAuth.js";

// Mounted at /api/freelancers/quotes: itemised estimates customers accept from their bookings.
export const freelancerQuotesRouter = Router();
freelancerQuotesRouter.use(requireQuotesAccess);
freelancerQuotesRouter.get("/", quotes.list);
freelancerQuotesRouter.post("/", validateQuoteCreate, quotes.create);
freelancerQuotesRouter.get("/:id", quotes.getOne);
freelancerQuotesRouter.patch("/:id", validateQuoteUpdate, quotes.update);
freelancerQuotesRouter.post("/:id/send", quotes.send);
freelancerQuotesRouter.post("/:id/withdraw", quotes.withdraw);
freelancerQuotesRouter.delete("/:id", quotes.remove);
