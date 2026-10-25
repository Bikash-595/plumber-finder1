import { createSingletonController } from "../../shared/createSingletonController.js";
import { openingHoursConfig } from "../config/openingHoursConfig.js";
import { CompanyOpeningHours } from "../models/CompanyOpeningHours.js";

export const openingHoursController = createSingletonController({ Model: CompanyOpeningHours, config: openingHoursConfig });
