import { createSingletonController } from "../../shared/createSingletonController.js";
import { openingHoursConfig } from "../config/openingHoursConfig.js";
import { FreelancerOpeningHours } from "../models/FreelancerOpeningHours.js";

export const openingHoursController = createSingletonController({ Model: FreelancerOpeningHours, config: openingHoursConfig });
