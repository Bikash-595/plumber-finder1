import { createCollectionController } from "../../shared/createCollectionController.js";
import { faqsConfig } from "../config/faqsConfig.js";
import { FreelancerFaq } from "../models/FreelancerFaq.js";

export const faqsController = createCollectionController({ Model: FreelancerFaq, config: faqsConfig });
