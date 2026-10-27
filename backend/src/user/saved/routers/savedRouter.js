import { Router } from "express";
import { recordAfterSuccess } from "../../../activity/recordActivity.js";
import { verifyProvider } from "../../shared/verifyProvider.js";
import { rejectSavedDuplicate, removeSavedByProvider, savedController } from "../controllers/savedController.js";
import { requireSavedAccess } from "../middleware/savedAuth.js";
import { validateSaved } from "../middleware/validateSaved.js";

// Mounted at /api/users/saved. Items are added or removed (no editing).
export const savedRouter = Router();
savedRouter.use(requireSavedAccess);
savedRouter.get("/", savedController.list);
savedRouter.post("/", validateSaved, verifyProvider, rejectSavedDuplicate, recordAfterSuccess("save"), savedController.create);
savedRouter.delete("/provider/:providerType/:providerId", removeSavedByProvider);
savedRouter.delete("/:id", savedController.remove);
