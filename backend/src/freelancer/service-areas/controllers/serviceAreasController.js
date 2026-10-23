import { normalizeServiceAreas } from "../../../shared/profileSections/serviceAreas.js";
import { FreelancerListing } from "../../listing/models/FreelancerListing.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { serviceAreasConfig } from "../config/serviceAreasConfig.js";
import { FreelancerServiceArea } from "../models/FreelancerServiceArea.js";

export const serviceAreasController = createSingletonController({
  Model: FreelancerServiceArea,
  config: serviceAreasConfig,
  beforeSave: normalizeServiceAreas,
  // Keep the public listing's service areas (used by search and filters) in sync.
  afterSave: (doc, { freelancer }) => FreelancerListing.updateOne({ freelancer }, { $set: { serviceAreas: doc.areas } }),
  afterDelete: ({ freelancer }) => FreelancerListing.updateOne({ freelancer }, { $set: { serviceAreas: [] } }),
});
