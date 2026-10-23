import { createSingletonController } from "../../shared/createSingletonController.js";
import { socialLinksConfig } from "../config/socialLinksConfig.js";
import { FreelancerSocialLinks } from "../models/FreelancerSocialLinks.js";

export const socialLinksController = createSingletonController({ Model: FreelancerSocialLinks, config: socialLinksConfig });
