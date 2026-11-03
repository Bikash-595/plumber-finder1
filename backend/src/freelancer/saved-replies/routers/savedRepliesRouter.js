import { Router } from "express";
import { savedRepliesController as replies } from "../controllers/savedRepliesController.js";
import { requireSavedRepliesAccess } from "../middleware/savedRepliesAuth.js";
import { validateSavedReplyCreate, validateSavedReplyUpdate } from "../middleware/validateSavedReplies.js";

// Mounted at /api/freelancers/saved-replies (private to the freelancer).
export const freelancerSavedRepliesRouter = Router();
freelancerSavedRepliesRouter.use(requireSavedRepliesAccess);
freelancerSavedRepliesRouter.get("/", replies.list);
freelancerSavedRepliesRouter.post("/", validateSavedReplyCreate, replies.create);
freelancerSavedRepliesRouter.patch("/:id", validateSavedReplyUpdate, replies.update);
freelancerSavedRepliesRouter.delete("/:id", replies.remove);
