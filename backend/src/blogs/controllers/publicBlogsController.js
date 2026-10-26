import { CompanyBlog } from "../../company/blogs/models/CompanyBlog.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { FreelancerBlog } from "../../freelancer/blogs/models/FreelancerBlog.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { PlatformBlog } from "../models/PlatformBlog.js";
import { withViews } from "../engagement/views.js";
import { publishedBlogs } from "../../shared/profileSections/publicFilters.js";

const MAX_POSTS = 200;
const readTime = (content = "") => Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200));

/** Published posts of published owners, newest first, without the full article text. */
async function postsFor(BlogModel, ListingModel, ownerField, type) {
  const listings = await ListingModel.find({ isPublished: true }).select(`${ownerField} slug companyName displayName rating`).lean();
  const byOwner = new Map(listings.map((listing) => [String(listing[ownerField]), listing]));
  const posts = await BlogModel.find({ [ownerField]: { $in: listings.map((listing) => listing[ownerField]) }, ...publishedBlogs() })
    .sort({ publishDate: -1 }).limit(MAX_POSTS).select(`${ownerField} slug title category excerpt content coverImage author publishDate tags`).lean();
  return (await withViews(posts, type)).map(({ [ownerField]: owner, content, _id, ...post }) => {
    const listing = byOwner.get(String(owner));
    return {
      ...post,
      id: String(_id),
      readTime: readTime(content),
      provider: { type, id: String(listing._id), slug: type === "company" ? listing.slug : undefined, name: listing.companyName ?? listing.displayName, rating: listing.rating ?? 0 },
    };
  });
}

// Plumber Finder's own articles appear in the feed as provider "platform" (their page is /blogs/<slug>).
const platformProvider = { type: "platform", id: "plumber-finder", name: "Plumber Finder", rating: 0 };
async function platformPosts() {
  const posts = await PlatformBlog.find(publishedBlogs()).sort({ publishDate: -1 }).limit(MAX_POSTS).select("slug title category excerpt content coverImage author publishDate tags").lean();
  return (await withViews(posts, "platform")).map(({ content, _id, ...post }) => ({ ...post, id: String(_id), readTime: readTime(content), provider: platformProvider }));
}

/** GET /api/blogs/platform/:slug — one of Plumber Finder's published articles, in full. */
export async function getPlatformBlog(req, res, next) {
  try {
    const post = await PlatformBlog.findOne({ slug: String(req.params.slug).toLowerCase(), ...publishedBlogs() }).select("-__v").lean();
    if (!post) return res.status(404).json({ message: "Article not found." });
    const [withCount] = await withViews([post], "platform");
    res.json({ data: { ...withCount, id: String(post._id), readTime: readTime(post.content), provider: platformProvider } });
  } catch (error) { next(error); }
}

/** GET /api/blogs — every published blog post from companies, freelancers, and Plumber Finder. */
export async function getPublicBlogs(_req, res, next) {
  try {
    const [companies, freelancers, platform] = await Promise.all([
      postsFor(CompanyBlog, CompanyListing, "company", "company"),
      postsFor(FreelancerBlog, FreelancerListing, "freelancer", "freelancer"),
      platformPosts(),
    ]);
    const data = [...platform, ...companies, ...freelancers].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)).slice(0, MAX_POSTS);
    res.json({ data });
  } catch (error) { next(error); }
}
