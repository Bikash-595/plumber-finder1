import { createValidator } from "../../shared/createValidator.js";
import { galleryConfig } from "../config/galleryConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validateGalleryCreate = createValidator(galleryConfig);
export const validateGalleryUpdate = createValidator(galleryConfig, { partial: true });
