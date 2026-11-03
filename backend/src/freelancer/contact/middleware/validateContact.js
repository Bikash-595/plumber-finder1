import { createValidator } from "../../shared/createValidator.js";
import { contactConfig } from "../config/contactConfig.js";

export const validateContact = createValidator(contactConfig);
