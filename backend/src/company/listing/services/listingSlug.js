import { CompanyListing } from "../models/CompanyListing.js";

// Public company URLs are /company/<slug>, e.g. "abc-plumbing", then "abc-plumbing-2" for the next
// company with the same name. A renamed company keeps its old slugs in `previousSlugs` so old links
// still resolve (and redirect) and nobody else can take them.
export const slugify = (value) => String(value ?? "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The `$set` fields for a company's listing slug when its name is `companyName` ({} when unchanged). */
export async function listingSlugUpdate(company, companyName) {
  const base = slugify(companyName) || "company";
  const existing = await CompanyListing.findOne({ company }).select("slug previousSlugs").lean();
  // Keep "abc-plumbing" or "abc-plumbing-2" when the name still produces the same base.
  if (existing?.slug && new RegExp(`^${escapeRegex(base)}(-\\d{1,4})?$`).test(existing.slug)) return {};
  for (let n = 1; n < 10_000; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const taken = await CompanyListing.exists({ company: { $ne: company }, $or: [{ slug }, { previousSlugs: slug }] });
    if (taken) continue;
    const previousSlugs = existing?.slug ? [...new Set([...(existing.previousSlugs ?? []), existing.slug])].filter((old) => old !== slug) : [];
    return { slug, previousSlugs };
  }
  throw new Error("Could not create a unique company URL.");
}
