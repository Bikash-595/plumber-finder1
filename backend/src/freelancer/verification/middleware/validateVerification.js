import { createValidator } from "../../shared/createValidator.js";
import { verificationConfig } from "../config/verificationConfig.js";

export const validateVerification = createValidator(verificationConfig);
