import mongoose from "mongoose";
import { blogFaqsSchema } from "../../../shared/profileSections/blogFaqs.js";

const freelancerBlogSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, lowercase: true, trim: true },
  category: { type: String, trim: true, maxlength: 80 },
  excerpt: { type: String, required: true, trim: true, maxlength: 500 },
  content: { type: String, required: true, maxlength: 50000 },
  coverImage: { type: String },
  author: { type: String, trim: true, maxlength: 120 },
  publishDate: { type: Date },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  faqs: blogFaqsSchema,
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "freelancer_blogs" });

// A freelancer's post URLs (/plumber/:id/blog/:slug) must be unique per freelancer.
freelancerBlogSchema.index({ freelancer: 1, slug: 1 }, { unique: true });

export const FreelancerBlog = mongoose.model("FreelancerBlog", freelancerBlogSchema);
