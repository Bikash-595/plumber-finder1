import { createCollectionController } from "../../shared/createCollectionController.js";
import { branchesConfig } from "../config/branchesConfig.js";
import { CompanyBranch } from "../models/CompanyBranch.js";

export const branchesController = createCollectionController({ Model: CompanyBranch, config: branchesConfig });
