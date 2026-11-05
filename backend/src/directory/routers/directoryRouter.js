import { Router } from "express";
import { rateLimit } from "../../reviews/middleware/rateLimit.js";
import { getDirectorySitemap, getRankingPage } from "../controllers/directoryController.js";
import { providers, search, suggestions } from "../controllers/searchController.js";

// Public, read-only. Mounted at /api/directory and /api/search (see app.js).
const limitReads = rateLimit({ windowMs: 60_000, max: 240, message: "Too many searches. Please wait a moment." });

export const directoryRouter = Router();
directoryRouter.get("/rankings/:limit/:noun/:state{/:city}", limitReads, getRankingPage);
directoryRouter.get("/sitemap", getDirectorySitemap);

export const searchRouter = Router();
searchRouter.get("/", limitReads, search);
searchRouter.get("/suggestions", limitReads, suggestions);
searchRouter.get("/providers", limitReads, providers);
