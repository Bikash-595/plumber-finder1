import { blogFaqsField } from "../../../shared/profileSections/blogFaqs.js";

// Plumber Finder's own blog posts (admins only). Same fields as company/freelancer posts.
export const platformBlogsConfig = {
  label: "Blog post",
  fields: {
    title: { type: "string", required: true, max: 200 },
    category: { type: "string", max: 80 },
    excerpt: { type: "text", required: true, max: 500 },
    content: { type: "text", required: true, max: 50000 },
    coverImage: { type: "image" },
    author: { type: "string", max: 120 },
    publishDate: { type: "date" },
    tags: { type: "list", maxItems: 20, max: 40 },
    faqs: blogFaqsField,
    status: { type: "enum", values: ["draft", "published"], default: "draft" },
  },
};
