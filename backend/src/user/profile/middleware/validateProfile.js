import { createValidator } from "../../shared/createValidator.js";
import { profileConfig } from "../config/profileConfig.js";

export const validateProfile = createValidator(profileConfig);
