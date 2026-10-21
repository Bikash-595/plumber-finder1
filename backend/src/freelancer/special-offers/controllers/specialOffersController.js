import { createCollectionController } from "../../shared/createCollectionController.js";
import { specialOffersConfig } from "../config/specialOffersConfig.js";
import { FreelancerSpecialOffer } from "../models/FreelancerSpecialOffer.js";

// Offers run through the whole of their end date (dates are stored as midnight UTC).
function currentOffers() {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return {
    active: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $gte: startOfToday } }] },
    ],
  };
}

export const specialOffersController = createCollectionController({
  Model: FreelancerSpecialOffer,
  config: specialOffersConfig,
  publicFilter: currentOffers,
});
