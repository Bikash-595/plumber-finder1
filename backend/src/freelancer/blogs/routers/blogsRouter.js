import { Router } from "express";
import { blogsController } from "../controllers/blogsController.js";
import { requireFreelancerBlogsAccess } from "../middleware/blogsAuth.js";
import { validateBlogsCreate, validateBlogsUpdate } from "../middleware/validateBlogs.js";

export const blogsRouter = Router();

// Public: blog posts shown on a published freelancer profile (by public listing id).
blogsRouter.get("/public/:listingId", blogsController.listPublic);

// Signed-in freelancer: manage its own blog posts.
blogsRouter.get("/", requireFreelancerBlogsAccess, blogsController.list);
blogsRouter.post("/", requireFreelancerBlogsAccess, validateBlogsCreate, blogsController.create);
blogsRouter.get("/:id", requireFreelancerBlogsAccess, blogsController.getOne);
blogsRouter.put("/:id", requireFreelancerBlogsAccess, validateBlogsUpdate, blogsController.update);
blogsRouter.patch("/:id", requireFreelancerBlogsAccess, validateBlogsUpdate, blogsController.update);
blogsRouter.delete("/:id", requireFreelancerBlogsAccess, blogsController.remove);
