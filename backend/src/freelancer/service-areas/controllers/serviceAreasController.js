import { FreelancerListing } from "../../listing/models/FreelancerListing.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { serviceAreasConfig } from "../config/serviceAreasConfig.js";
import { FreelancerServiceArea } from "../models/FreelancerServiceArea.js";

const parseAreas = (text) => [...new Set((text ?? "").split(",").map((area) => area.trim()).filter(Boolean))].slice(0, 200);

export const serviceAreasController = createSingletonController({
  Model: FreelancerServiceArea,
  config: serviceAreasConfig,
  beforeSave: (values) => {
    if ("areasCovered" in values) values.areas = parseAreas(values.areasCovered);
  },
  // Keep the public listing's service areas (used by search and filters) in sync.
  afterSave: (doc, { freelancer }) => FreelancerListing.updateOne({ freelancer }, { $set: { serviceAreas: doc.areas } }),
});
