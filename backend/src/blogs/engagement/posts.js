import mongoose from "mongoose";
import { Company } from "../../auth/company/models/Company.js";
import { Freelancer } from "../../auth/freelancer/models/Freelancer.js";
import { User } from "../../auth/user/models/User.js";
import { CompanyBlog } from "../../company/blogs/models/CompanyBlog.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { FreelancerBlog } from "../../freelancer/blogs/models/FreelancerBlog.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { publishedBlogs } from "../../shared/profileSections/publicFilters.js";
import { PlatformBlog } from "../models/PlatformBlog.js";

// The site's sample plumbers' posts live in the frontend; they are identified as "<plumber id>--<post slug>".
const DEMO_ID = /^[a-z0-9-]{1,40}--[a-z0-9-]{1,160}$/;

/**
 * Finds a published post from the URL (:type/:id). Returns { key, title, link, owner } or null.
 * `owner` is who wrote it ({ accountType, account }; admin for Plumber Finder's posts; null for samples).
 */
export async function resolvePost(type, id) {
  if (type === "demo") return DEMO_ID.test(id) ? { key: `demo:${id}`, title: id.split("--")[1].replace(/-/g, " "), link: `/plumber/${id.split("--")[0]}/blog/${id.split("--")[1]}`, owner: null, provider: /^\d{1,6}$/.test(id.split("--")[0]) ? { type: "company", id: id.split("--")[0] } : null } : null;
  if (!mongoose.isValidObjectId(id)) return null;
  if (type === "platform") {
    const post = await PlatformBlog.findOne({ _id: id, ...publishedBlogs() }).select("slug title").lean();
    return post && { key: `platform:${id}`, title: post.title, link: `/blogs/${post.slug}`, owner: { accountType: "admin", account: null } };
  }
  if (type === "company") {
    const post = await CompanyBlog.findOne({ _id: id, ...publishedBlogs() }).select("company slug title").lean();
    const listing = post && await CompanyListing.findOne({ company: post.company, isPublished: true }).select("slug companyName").lean();
    return listing && { key: `company:${id}`, title: post.title, link: `/company/${listing.slug}/blog/${post.slug}`, owner: { accountType: "company", account: post.company }, provider: { type: "company", id: String(listing._id), name: listing.companyName } };
  }
  if (type === "freelancer") {
    const post = await FreelancerBlog.findOne({ _id: id, ...publishedBlogs() }).select("freelancer slug title").lean();
    const listing = post && await FreelancerListing.findOne({ freelancer: post.freelancer, isPublished: true }).select("_id displayName").lean();
    return listing && { key: `freelancer:${id}`, title: post.title, link: `/plumber/${listing._id}/blog/${post.slug}`, owner: { accountType: "freelancer", account: post.freelancer }, provider: { type: "freelancer", id: String(listing._id), name: listing.displayName } };
  }
  return null;
}

/** The name shown on a comment for the signed-in account. */
export async function displayName({ accountType, sub }) {
  if (accountType === "admin") return "Plumber Finder";
  if (accountType === "user") return (await User.findById(sub).select("name").lean())?.name ?? null;
  if (accountType === "company") {
    const [listing, account] = await Promise.all([CompanyListing.findOne({ company: sub }).select("companyName").lean(), Company.findById(sub).select("companyName").lean()]);
    return listing?.companyName ?? account?.companyName ?? null;
  }
  if (accountType === "freelancer") {
    const [listing, account] = await Promise.all([FreelancerListing.findOne({ freelancer: sub }).select("displayName").lean(), Freelancer.findById(sub).select("name").lean()]);
    return listing?.displayName ?? account?.name ?? null;
  }
  return null;
}

/** Did this account write the post? (Any admin speaks for Plumber Finder's posts.) */
export const isOwner = (post, accountType, account) => Boolean(post.owner) && post.owner.accountType === accountType && (accountType === "admin" || String(post.owner.account) === String(account));
