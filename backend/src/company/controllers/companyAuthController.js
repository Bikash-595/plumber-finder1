import { createAuthController } from "../../controllers/createAuthController.js";
import { companyAuthConfig } from "../config/authConfig.js";
import { Company } from "../models/Company.js";

export const companyAuthController = createAuthController({ Model: Company, ...companyAuthConfig });
