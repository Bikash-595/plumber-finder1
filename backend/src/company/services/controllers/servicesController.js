import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { SERVICE_LIST_SELECT, syncPriceLabel } from "../../../shared/profileSections/servicesSection.js";
import { createCollectionController } from "../../shared/createCollectionController.js";
import { servicesConfig } from "../config/servicesConfig.js";
import { CompanyServiceOffering } from "../models/CompanyServiceOffering.js";
import { withMediaUrls } from "../../../media/mediaUrls.js";

// The public listing's `services` drive search and the /services/[slug] pages.
async function syncListingServices({ company }) {
  const services = await CompanyServiceOffering.find({ company }).sort({ position: 1, createdAt: 1 }).select("name").lean();
  await CompanyListing.updateOne({ company }, { $set: { services: services.map((service) => service.name) } });
}

export const servicesController = createCollectionController({
  // Public responses link to uploaded pictures (/media/...) instead of carrying them.
  publicView: (item) => withMediaUrls("company-service", item, ["image", "images"]),
  Model: CompanyServiceOffering,
  config: servicesConfig,
  beforeWrite: syncPriceLabel,
  afterChange: syncListingServices,
  listSelect: SERVICE_LIST_SELECT,
});
