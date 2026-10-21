import { createCollectionController } from "../../shared/createCollectionController.js";
import { faqsConfig } from "../config/faqsConfig.js";
import { CompanyFaq } from "../models/CompanyFaq.js";

export const faqsController = createCollectionController({ Model: CompanyFaq, config: faqsConfig });
