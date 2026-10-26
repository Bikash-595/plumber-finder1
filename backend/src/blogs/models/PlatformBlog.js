import mongoose from "mongoose";
import { blogFaqsSchema } from "../../shared/profileSections/blogFaqs.js";

// Plumber Finder's own articles, written by admins and shown at /blogs/<slug> and in the blog feed.
const platformBlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, lowercase: true, trim: true, unique: true },
  category: { type: String, trim: true, maxlength: 80 },
  excerpt: { type: String, required: true, trim: true, maxlength: 500 },
  content: { type: String, required: true, maxlength: 50000 },
  coverImage: { type: String },
  author: { type: String, trim: true, maxlength: 120 },
  publishDate: { type: Date },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  faqs: blogFaqsSchema,
  status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true, collection: "platform_blogs" });

export const PlatformBlog = mongoose.model("PlatformBlog", platformBlogSchema);
