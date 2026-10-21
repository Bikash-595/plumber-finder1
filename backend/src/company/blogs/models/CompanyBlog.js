import mongoose from "mongoose";

const companyBlogSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, lowercase: true, trim: true },
  category: { type: String, trim: true, maxlength: 80 },
  excerpt: { type: String, required: true, trim: true, maxlength: 500 },
  content: { type: String, required: true, maxlength: 50000 },
  coverImage: { type: String },
  author: { type: String, trim: true, maxlength: 120 },
  publishDate: { type: Date },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_blogs" });

// A company's post URLs (/plumber/:id/blog/:slug) must be unique per company.
companyBlogSchema.index({ company: 1, slug: 1 }, { unique: true });

export const CompanyBlog = mongoose.model("CompanyBlog", companyBlogSchema);
