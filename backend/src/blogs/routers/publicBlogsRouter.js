import { Router } from "express";
import { getPublicBlogs } from "../controllers/publicBlogsController.js";

// Mounted at /api/blogs — the site-wide blog page.
export const publicBlogsRouter = Router();
publicBlogsRouter.get("/", getPublicBlogs);
