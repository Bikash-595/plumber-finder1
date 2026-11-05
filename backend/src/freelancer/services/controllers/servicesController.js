import { FreelancerListing } from "../../listing/models/FreelancerListing.js";
import { SERVICE_LIST_SELECT, syncPriceLabel } from "../../../shared/profileSections/servicesSection.js";
import { createCollectionController } from "../../shared/createCollectionController.js";
import { servicesConfig } from "../config/servicesConfig.js";
import { FreelancerServiceOffering } from "../models/FreelancerServiceOffering.js";
import { withMediaUrls } from "../../../media/mediaUrls.js";

// The public listing's `services` drive search and the /services/[slug] pages.
async function syncListingServices({ freelancer }) {
  const services = await FreelancerServiceOffering.find({ freelancer }).sort({ position: 1, createdAt: 1 }).select("name").lean();
  await FreelancerListing.updateOne({ freelancer }, { $set: { services: services.map((service) => service.name) } });
}

export const servicesController = createCollectionController({
  // Public responses link to uploaded pictures (/media/...) instead of carrying them.
  publicView: (item) => withMediaUrls("freelancer-service", item, ["image", "images"]),
  Model: FreelancerServiceOffering,
  config: servicesConfig,
  beforeWrite: syncPriceLabel,
  afterChange: syncListingServices,
  listSelect: SERVICE_LIST_SELECT,
});
