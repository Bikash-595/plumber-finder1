// Where the company is on the map: its address, exact coordinates, and how far it travels.
const coordinate = (limit) => ({ type: "number", min: -limit, max: limit });

export const locationConfig = {
  label: "Map location",
  fields: {
    headquarters: { type: "string", max: 300 },
    latitude: coordinate(90),
    longitude: coordinate(180),
    serviceRadius: { type: "number", min: 0, max: 500 },
    mapUrl: { type: "string", max: 500, pattern: /^https?:\/\/[^\s]+$/i, patternMessage: "must be a full link starting with https://" },
  },
  // Only these fields belong to this section; the wizard's other location fields are left alone.
  stored: ["headquarters", "latitude", "longitude", "serviceRadius", "mapUrl"],
};
