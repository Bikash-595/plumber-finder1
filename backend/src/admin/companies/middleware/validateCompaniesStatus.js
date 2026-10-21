import { createValidator } from "../../../shared/profileSections/createValidator.js";
import { companiesConfig } from "../config/companiesConfig.js";

export const validateCompaniesStatus = createValidator({ label: "status", fields: companiesConfig.statusFields });
