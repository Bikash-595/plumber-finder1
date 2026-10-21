import { createSingletonController } from "../../shared/createSingletonController.js";
import { companyOverviewConfig } from "../config/companyOverviewConfig.js";
import { CompanyOverview } from "../models/CompanyOverview.js";

export const companyOverviewController = createSingletonController({ Model: CompanyOverview, config: companyOverviewConfig });
