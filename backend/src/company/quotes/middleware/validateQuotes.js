import { createValidator } from "../../shared/createValidator.js";
import { quotesConfig } from "../config/quotesConfig.js";

export const validateQuoteCreate = createValidator(quotesConfig.quote);
export const validateQuoteUpdate = createValidator(quotesConfig.quote, { partial: true });
