import { CompanyBlog } from "../../company/blogs/models/CompanyBlog.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { FreelancerBlog } from "../../freelancer/blogs/models/FreelancerBlog.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { publishedBlogs } from "../../shared/profileSections/publicFilters.js";

const MAX_POSTS = 200;
const readTime = (content = "") => Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200));

/** Published posts of published owners, newest first, without the full article text. */
async function postsFor(BlogModel, ListingModel, ownerField, type) {
  const listings = await ListingModel.find({ isPublished: true }).select(`${ownerField} slug companyName displayName rating`).lean();
  const byOwner = new Map(listings.map((listing) => [String(listing[ownerField]), listing]));
  const posts = await BlogModel.find({ [ownerField]: { $in: listings.map((listing) => listing[ownerField]) }, ...publishedBlogs() })
    .sort({ publishDate: -1 }).limit(MAX_POSTS).select(`${ownerField} slug title category excerpt content coverImage author publishDate tags`).lean();
  return posts.map(({ [ownerField]: owner, content, _id, ...post }) => {
    const listing = byOwner.get(String(owner));
    return {
      ...post,
      id: String(_id),
      readTime: readTime(content),
      provider: { type, id: String(listing._id), slug: type === "company" ? listing.slug : undefined, name: listing.companyName ?? listing.displayName, rating: listing.rating ?? 0 },
    };
  });
}

/** GET /api/blogs — every published blog post from companies and freelancers. */
export async function getPublicBlogs(_req, res, next) {
  try {
    const [companies, freelancers] = await Promise.all([
      postsFor(CompanyBlog, CompanyListing, "company", "company"),
      postsFor(FreelancerBlog, FreelancerListing, "freelancer", "freelancer"),
    ]);
    const data = [...companies, ...freelancers].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)).slice(0, MAX_POSTS);
    res.json({ data });
  } catch (error) { next(error); }
}
