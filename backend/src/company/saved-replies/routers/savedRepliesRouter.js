import { Router } from "express";
import { savedRepliesController as replies } from "../controllers/savedRepliesController.js";
import { requireSavedRepliesAccess } from "../middleware/savedRepliesAuth.js";
import { validateSavedReplyCreate, validateSavedReplyUpdate } from "../middleware/validateSavedReplies.js";

// Mounted at /api/companies/saved-replies (private to the company).
export const companySavedRepliesRouter = Router();
companySavedRepliesRouter.use(requireSavedRepliesAccess);
companySavedRepliesRouter.get("/", replies.list);
companySavedRepliesRouter.post("/", validateSavedReplyCreate, replies.create);
companySavedRepliesRouter.patch("/:id", validateSavedReplyUpdate, replies.update);
companySavedRepliesRouter.delete("/:id", replies.remove);
