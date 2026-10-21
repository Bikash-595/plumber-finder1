// Freelancer articles. Only `published` posts appear publicly; the URL slug is generated from the title.
export const blogsConfig = {
  label: "Blog post",
  labelPlural: "blog posts",
  maxItems: 200,
  statuses: ["draft", "published"],
  fields: {
    title: { type: "string", required: true, max: 200 },
    category: { type: "string", max: 80 },
    excerpt: { type: "text", required: true, max: 500 },
    content: { type: "text", required: true, max: 50000 },
    coverImage: { type: "image" },
    author: { type: "string", max: 120 },
    publishDate: { type: "date" },
    tags: { type: "list", maxItems: 20, max: 40 },
    status: { type: "enum", values: ["draft", "published"], default: "draft" },
  },
};
