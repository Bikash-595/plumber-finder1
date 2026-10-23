import { CompanyListing } from "../models/CompanyListing.js";
import { cardSummaries, fullProfile } from "../services/publicProfile.js";

// Public directory of published companies (home page cards, /plumber/:id profiles).
export async function getPublishedCompanies(_req, res, next) {
  try {
    const listings = await CompanyListing.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
    const summaries = await cardSummaries(listings);
    res.json({ data: listings.map(({ company, __v, ...listing }) => ({ ...listing, ...summaries.get(String(company)) })) });
  } catch (error) { next(error); }
}

export async function getPublishedCompany(req, res, next) {
  try {
    const listing = await CompanyListing.findOne({ _id: req.params.id, isPublished: true });
    if (!listing) return res.status(404).json({ message: "Company listing not found." });
    res.json({ data: listing });
  } catch (error) { next(error); }
}

/**
 * GET /public/:idOrSlug/profile — the listing plus every public section (team, blogs, projects, hours, ...).
 * Accepts the listing id or its URL slug; an old slug (from before a rename) also matches, and the
 * response's `slug` is the current one so the page can redirect.
 */
export async function getPublishedCompanyProfile(req, res, next) {
  try {
    const key = String(req.params.id).toLowerCase();
    const filter = /^[a-f0-9]{24}$/.test(key) ? { _id: key } : { $or: [{ slug: key }, { previousSlugs: key }] };
    const listing = await CompanyListing.findOne({ ...filter, isPublished: true }).lean();
    if (!listing) return res.status(404).json({ message: "Company listing not found." });
    res.json({ data: await fullProfile(listing) });
  } catch (error) { next(error); }
}
