import { currentOffers } from "../../../shared/profileSections/publicFilters.js";
import { createCollectionController } from "../../shared/createCollectionController.js";
import { specialOffersConfig } from "../config/specialOffersConfig.js";
import { CompanySpecialOffer } from "../models/CompanySpecialOffer.js";

export const specialOffersController = createCollectionController({
  Model: CompanySpecialOffer,
  config: specialOffersConfig,
  publicFilter: currentOffers,
});
