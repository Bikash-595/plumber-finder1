import { publishedBlogs } from "../../../shared/profileSections/publicFilters.js";
import { createCollectionController } from "../../shared/createCollectionController.js";
import { blogsConfig } from "../config/blogsConfig.js";
import { FreelancerBlog } from "../models/FreelancerBlog.js";

const slugify = (title) => title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "post";

/** "my-post", then "my-post-2", "my-post-3", ... skipping the post being edited. */
async function uniqueSlug(title, freelancer, id) {
  const base = slugify(title);
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const clash = await FreelancerBlog.exists({ freelancer, slug, ...(id ? { _id: { $ne: id } } : {}) });
    if (!clash) return slug;
  }
}

export const blogsController = createCollectionController({
  Model: FreelancerBlog,
  config: blogsConfig,
  beforeWrite: async (values, { freelancer, id }) => {
    if (values.title) values.slug = await uniqueSlug(values.title, freelancer, id);
    // A published post always has a publish date: stamp one when publishing without a date, and
    // never let an update clear the date of a post that stays published (it would vanish publicly).
    const missingDate = values.status === "published" ? !values.publishDate : "publishDate" in values && !values.publishDate;
    if (missingDate) {
      const existing = id ? await FreelancerBlog.findOne({ _id: id, freelancer }).select("status publishDate").lean() : null;
      const willBePublished = values.status === "published" || (!("status" in values) && existing?.status === "published");
      if (willBePublished) {
        if (existing?.publishDate) delete values.publishDate; // keep the original date
        else values.publishDate = new Date();
      }
    }
  },
  publicFilter: publishedBlogs,
});
