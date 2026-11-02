import { Router } from "express";
import { quotesController as quotes } from "../controllers/quotesController.js";
import { requireQuotesAccess } from "../middleware/quotesAuth.js";
import { validateQuoteCreate, validateQuoteUpdate } from "../middleware/validateQuotes.js";

// Mounted at /api/companies/quotes.
export const companyQuotesRouter = Router();
companyQuotesRouter.use(requireQuotesAccess);
companyQuotesRouter.get("/", quotes.list);
companyQuotesRouter.post("/", validateQuoteCreate, quotes.create);
companyQuotesRouter.get("/:id", quotes.getOne);
companyQuotesRouter.patch("/:id", validateQuoteUpdate, quotes.update);
companyQuotesRouter.post("/:id/send", quotes.send);
companyQuotesRouter.post("/:id/withdraw", quotes.withdraw);
companyQuotesRouter.delete("/:id", quotes.remove);
