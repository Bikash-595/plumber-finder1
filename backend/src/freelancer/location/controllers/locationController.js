import { createSingletonController } from "../../shared/createSingletonController.js";
import { locationConfig } from "../config/locationConfig.js";
import { FreelancerLocation } from "../models/FreelancerLocation.js";

export const locationController = createSingletonController({ Model: FreelancerLocation, config: locationConfig });
