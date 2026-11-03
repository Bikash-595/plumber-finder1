import { createValidator } from "../../shared/createValidator.js";
import { branchesConfig } from "../config/branchesConfig.js";

export const validateBranchesCreate = createValidator(branchesConfig);
export const validateBranchesUpdate = createValidator(branchesConfig, { partial: true });
