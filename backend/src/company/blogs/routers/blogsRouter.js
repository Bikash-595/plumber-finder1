import { Router } from "express";
import { blogsController } from "../controllers/blogsController.js";
import { requireCompanyBlogsAccess } from "../middleware/blogsAuth.js";
import { validateBlogsCreate, validateBlogsUpdate } from "../middleware/validateBlogs.js";

export const blogsRouter = Router();

// Public: blog posts shown on a published company profile (by public listing id).
blogsRouter.get("/public/:listingId", blogsController.listPublic);

// Signed-in company: manage its own blog posts.
blogsRouter.get("/", requireCompanyBlogsAccess, blogsController.list);
blogsRouter.post("/", requireCompanyBlogsAccess, validateBlogsCreate, blogsController.create);
blogsRouter.get("/:id", requireCompanyBlogsAccess, blogsController.getOne);
blogsRouter.put("/:id", requireCompanyBlogsAccess, validateBlogsUpdate, blogsController.update);
blogsRouter.patch("/:id", requireCompanyBlogsAccess, validateBlogsUpdate, blogsController.update);
blogsRouter.delete("/:id", requireCompanyBlogsAccess, blogsController.remove);
