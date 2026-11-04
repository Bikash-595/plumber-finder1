import { createSingletonController } from "../../shared/createSingletonController.js";
import { seoConfig } from "../config/seoConfig.js";
import { FreelancerSeo } from "../models/FreelancerSeo.js";

export const seoController = createSingletonController({ Model: FreelancerSeo, config: seoConfig });
