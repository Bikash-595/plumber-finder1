// Where the freelancer is based: address, exact coordinates and travel radius (the profile map uses them).
import { locationConfig as companyLocation } from "../../../company/location/config/locationConfig.js";

export const locationConfig = {
  label: "Map location",
  fields: companyLocation.fields,
  validate: ({ latitude, longitude }) => ((latitude == null) !== (longitude == null) ? { latitude: "enter both latitude and longitude, or neither" } : null),
};
