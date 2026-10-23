import { currentOffers } from "../../../shared/profileSections/publicFilters.js";
import { createCollectionController } from "../../shared/createCollectionController.js";
import { specialOffersConfig } from "../config/specialOffersConfig.js";
import { FreelancerSpecialOffer } from "../models/FreelancerSpecialOffer.js";

export const specialOffersController = createCollectionController({
  Model: FreelancerSpecialOffer,
  config: specialOffersConfig,
  publicFilter: currentOffers,
});
