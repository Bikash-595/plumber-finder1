import { Router } from "express";
import { branchesController } from "../controllers/branchesController.js";
import { requireCompanyBranchesAccess } from "../middleware/branchesAuth.js";
import { validateBranchesCreate, validateBranchesUpdate } from "../middleware/validateBranches.js";

export const branchesRouter = Router();

// Public: branches shown on a published company profile (by public listing id).
branchesRouter.get("/public/:listingId", branchesController.listPublic);

// Signed-in company: manage its own branches.
branchesRouter.get("/", requireCompanyBranchesAccess, branchesController.list);
branchesRouter.post("/", requireCompanyBranchesAccess, validateBranchesCreate, branchesController.create);
branchesRouter.get("/:id", requireCompanyBranchesAccess, branchesController.getOne);
branchesRouter.put("/:id", requireCompanyBranchesAccess, validateBranchesUpdate, branchesController.update);
branchesRouter.patch("/:id", requireCompanyBranchesAccess, validateBranchesUpdate, branchesController.update);
branchesRouter.delete("/:id", requireCompanyBranchesAccess, branchesController.remove);
