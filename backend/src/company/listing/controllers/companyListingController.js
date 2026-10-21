import { CompanyListing } from "../models/CompanyListing.js";

// Public directory of published companies (home page cards, /plumber/:id profiles).
export async function getPublishedCompanies(_req, res, next) {
  try { res.json({ data: await CompanyListing.find({ isPublished: true }).sort({ createdAt: -1 }) }); } catch (error) { next(error); }
}

export async function getPublishedCompany(req, res, next) {
  try {
    const listing = await CompanyListing.findOne({ _id: req.params.id, isPublished: true });
    if (!listing) return res.status(404).json({ message: "Company listing not found." });
    res.json({ data: listing });
  } catch (error) { next(error); }
}
