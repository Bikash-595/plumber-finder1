import { normalizeServiceAreas } from "../../../shared/profileSections/serviceAreas.js";
import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { serviceAreasConfig } from "../config/serviceAreasConfig.js";
import { CompanyServiceArea } from "../models/CompanyServiceArea.js";

export const serviceAreasController = createSingletonController({
  Model: CompanyServiceArea,
  config: serviceAreasConfig,
  beforeSave: normalizeServiceAreas,
  // Keep the public listing's service areas (used by search and filters) in sync.
  afterSave: (doc, { company }) => CompanyListing.updateOne({ company }, { $set: { serviceAreas: doc.areas } }),
  afterDelete: ({ company }) => CompanyListing.updateOne({ company }, { $set: { serviceAreas: [] } }),
});
