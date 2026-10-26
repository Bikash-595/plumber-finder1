import { Router } from "express";
import { createValidator } from "../../../shared/profileSections/createValidator.js";
import { requireAdmin } from "../../shared/requireAdmin.js";
import { platformBlogsConfig } from "../config/blogsConfig.js";
import { platformBlogsController } from "../controllers/blogsController.js";

// Mounted at /api/admin/blogs: Plumber Finder's own articles (with FAQs).
export const blogsRouter = Router();
blogsRouter.use(requireAdmin);
blogsRouter.get("/", platformBlogsController.list);
blogsRouter.post("/", createValidator(platformBlogsConfig), platformBlogsController.create);
blogsRouter.get("/:id", platformBlogsController.getOne);
blogsRouter.put("/:id", createValidator(platformBlogsConfig, { partial: true }), platformBlogsController.update);
blogsRouter.delete("/:id", platformBlogsController.remove);
