import { createSingletonController } from "../../shared/createSingletonController.js";
import { seoConfig } from "../config/seoConfig.js";
import { CompanySeo } from "../models/CompanySeo.js";

export const seoController = createSingletonController({ Model: CompanySeo, config: seoConfig });
