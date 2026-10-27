import { Router } from "express";
import { recordAfterSuccess } from "../../../activity/recordActivity.js";
import { verifyProvider } from "../../shared/verifyProvider.js";
import { rejectCompareDuplicate, removeCompareByProvider, compareController } from "../controllers/compareController.js";
import { requireCompareAccess } from "../middleware/compareAuth.js";
import { validateCompare } from "../middleware/validateCompare.js";

// Mounted at /api/users/compare. Items are added or removed (no editing).
export const compareRouter = Router();
compareRouter.use(requireCompareAccess);
compareRouter.get("/", compareController.list);
compareRouter.post("/", validateCompare, verifyProvider, rejectCompareDuplicate, recordAfterSuccess("compare_add"), compareController.create);
compareRouter.delete("/provider/:providerType/:providerId", removeCompareByProvider);
compareRouter.delete("/:id", compareController.remove);
