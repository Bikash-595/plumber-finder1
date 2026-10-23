import { createSingletonController } from "../../shared/createSingletonController.js";
import { socialLinksConfig } from "../config/socialLinksConfig.js";
import { CompanySocialLinks } from "../models/CompanySocialLinks.js";

export const socialLinksController = createSingletonController({ Model: CompanySocialLinks, config: socialLinksConfig });
