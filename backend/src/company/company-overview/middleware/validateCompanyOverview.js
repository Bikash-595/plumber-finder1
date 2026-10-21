import { createValidator } from "../../shared/createValidator.js";
import { companyOverviewConfig } from "../config/companyOverviewConfig.js";

export const validateCompanyOverview = createValidator(companyOverviewConfig);
