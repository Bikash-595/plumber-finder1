import mongoose from "mongoose";
import { PlatformBlog } from "../../../blogs/models/PlatformBlog.js";
import { paginatedList, searchFilter } from "../../shared/listQuery.js";

const slugify = (title) => title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "post";

/** "my-post", then "my-post-2", ... skipping the post being edited. */
async function uniqueSlug(title, id) {
  const base = slugify(title);
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!(await PlatformBlog.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) }))) return slug;
  }
}

/** A published post always has a publish date (today unless one is given); editing keeps the original. */
async function prepare(values, id) {
  if (values.title) values.slug = await uniqueSlug(values.title, id);
  if (values.status === "published" && !values.publishDate) {
    const existing = id ? await PlatformBlog.findById(id).select("publishDate").lean() : null;
    if (existing?.publishDate) delete values.publishDate;
    else values.publishDate = new Date();
  }
}
const notFound = (res) => res.status(404).json({ message: "Blog post not found." });
const validId = (id) => mongoose.isValidObjectId(id);

export const platformBlogsController = {
  // GET /?search=&status=&page= — drafts, scheduled, and published posts.
  list: async (req, res, next) => {
    try {
      const status = ["draft", "published"].includes(req.query.status) ? { status: req.query.status } : {};
      res.json(await paginatedList(PlatformBlog, { ...status, ...searchFilter(req.query.search, ["title", "category", "author"]) }, req.query, { sort: { updatedAt: -1 }, select: "-content" }));
    } catch (error) { next(error); }
  },
  getOne: async (req, res, next) => {
    try {
      const post = validId(req.params.id) && await PlatformBlog.findById(req.params.id).lean();
      if (!post) return notFound(res);
      res.json({ data: post });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const values = { ...req.validated };
      await prepare(values);
      res.status(201).json({ message: "Blog post saved.", data: await PlatformBlog.create(values) });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      if (!validId(req.params.id)) return notFound(res);
      const values = { ...req.validated };
      await prepare(values, req.params.id);
      const post = await PlatformBlog.findByIdAndUpdate(req.params.id, { $set: values }, { new: true, runValidators: true });
      if (!post) return notFound(res);
      res.json({ message: "Blog post updated.", data: post });
    } catch (error) { next(error); }
  },
  remove: async (req, res, next) => {
    try {
      const post = validId(req.params.id) && await PlatformBlog.findByIdAndDelete(req.params.id);
      if (!post) return notFound(res);
      res.json({ message: "Blog post deleted." });
    } catch (error) { next(error); }
  },
};
