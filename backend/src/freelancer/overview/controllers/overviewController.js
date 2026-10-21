import { createSingletonController } from "../../shared/createSingletonController.js";
import { overviewConfig } from "../config/overviewConfig.js";
import { FreelancerOverview } from "../models/FreelancerOverview.js";

export const overviewController = createSingletonController({ Model: FreelancerOverview, config: overviewConfig });
