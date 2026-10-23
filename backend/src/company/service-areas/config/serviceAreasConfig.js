import { serviceAreaFields, validateServiceAreas } from "../../../shared/profileSections/serviceAreas.js";

// Where the company works. each area can list the services offered there; `areasCovered` is the comma-separated text, as typed by the company.
export const serviceAreasConfig = {
  label: "Service areas",
  fields: serviceAreaFields,
  validate: validateServiceAreas,
};
