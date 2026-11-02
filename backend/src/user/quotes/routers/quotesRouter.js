import { Router } from "express";
import { requireUser } from "../../shared/requireUser.js";
import { userQuotesController as quotes } from "../controllers/quotesController.js";

// Mounted at /api/users/quotes — quotes plumbers sent the customer.
export const quotesRouter = Router();
quotesRouter.use(requireUser);
quotesRouter.get("/", quotes.list);
quotesRouter.post("/:id/accept", quotes.accept);
quotesRouter.post("/:id/decline", quotes.decline);
