import { createValidator } from "../../shared/createValidator.js";
import { blogsConfig } from "../config/blogsConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validateBlogsCreate = createValidator(blogsConfig);
export const validateBlogsUpdate = createValidator(blogsConfig, { partial: true });
