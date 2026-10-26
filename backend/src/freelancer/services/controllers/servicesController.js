import { FreelancerListing } from "../../listing/models/FreelancerListing.js";
import { syncPriceLabel } from "../../../shared/profileSections/servicesSection.js";
import { createCollectionController } from "../../shared/createCollectionController.js";
import { servicesConfig } from "../config/servicesConfig.js";
import { FreelancerServiceOffering } from "../models/FreelancerServiceOffering.js";

// The public listing's `services` drive search and the /services/[slug] pages.
async function syncListingServices({ freelancer }) {
  const services = await FreelancerServiceOffering.find({ freelancer }).sort({ position: 1, createdAt: 1 }).select("name").lean();
  await FreelancerListing.updateOne({ freelancer }, { $set: { services: services.map((service) => service.name) } });
}

export const servicesController = createCollectionController({
  Model: FreelancerServiceOffering,
  config: servicesConfig,
  beforeWrite: syncPriceLabel,
  afterChange: syncListingServices,
});
