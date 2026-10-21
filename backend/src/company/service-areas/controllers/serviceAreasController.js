import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { serviceAreasConfig } from "../config/serviceAreasConfig.js";
import { CompanyServiceArea } from "../models/CompanyServiceArea.js";

const parseAreas = (text) => [...new Set((text ?? "").split(",").map((area) => area.trim()).filter(Boolean))].slice(0, 200);

export const serviceAreasController = createSingletonController({
  Model: CompanyServiceArea,
  config: serviceAreasConfig,
  beforeSave: (values) => {
    if ("areasCovered" in values) values.areas = parseAreas(values.areasCovered);
  },
  // Keep the public listing's service areas (used by search and filters) in sync.
  afterSave: (doc, { company }) => CompanyListing.updateOne({ company }, { $set: { serviceAreas: doc.areas } }),
});
