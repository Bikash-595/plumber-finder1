import { createValidator } from "../../shared/createValidator.js";
import { jobsConfig } from "../config/jobsConfig.js";

export const validateNote = createValidator(jobsConfig.note);
