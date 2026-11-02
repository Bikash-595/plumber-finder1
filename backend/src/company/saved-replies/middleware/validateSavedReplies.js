import { createValidator } from "../../shared/createValidator.js";
import { savedRepliesConfig } from "../config/savedRepliesConfig.js";

export const validateSavedReplyCreate = createValidator(savedRepliesConfig);
export const validateSavedReplyUpdate = createValidator(savedRepliesConfig, { partial: true });
