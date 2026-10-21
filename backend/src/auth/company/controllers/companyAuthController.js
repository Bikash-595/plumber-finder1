import { createAccountController } from "../../shared/controllers/createAccountController.js";
import { companyAuthConfig } from "../config/companyAuthConfig.js";
import { Company } from "../models/Company.js";

// Everything the shared sign-in methods need to know about company accounts.
export const companyAccount = { Model: Company, ...companyAuthConfig };

export const companyAuthController = createAccountController(companyAccount);
