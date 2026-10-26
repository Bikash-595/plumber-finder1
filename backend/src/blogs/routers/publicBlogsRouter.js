import { Router } from "express";
import { getPlatformBlog, getPublicBlogs } from "../controllers/publicBlogsController.js";
import { engagementRouter } from "../engagement/engagement.js";

// Mounted at /api/blogs — the site-wide blog page.
export const publicBlogsRouter = Router();
publicBlogsRouter.get("/", getPublicBlogs);
publicBlogsRouter.get("/platform/:slug", getPlatformBlog);
// Likes, dislikes, comments, and replies on any post.
publicBlogsRouter.use(engagementRouter);
