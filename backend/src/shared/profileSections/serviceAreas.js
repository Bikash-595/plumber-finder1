import { locateArea, stateOf } from "../../location/services/areaPlace.js";

// Service areas, shared by companies and freelancers: a base location (with coordinates used for
// "x miles away"), a radius, and the areas served — each with the services offered there.

export const serviceAreaFields = {
  areasCovered: { type: "text", max: 5000 },
  radius: { type: "number", min: 0, max: 500 },
  branchLocation: { type: "string", max: 200 },
  latitude: { type: "number", min: -90, max: 90 },
  longitude: { type: "number", min: -180, max: 180 },
  areaDetails: {
    type: "objects",
    maxItems: 100,
    fields: {
      name: { type: "string", required: true, max: 120 },
      // Where this area's work is based (street address or place); its map is centred here.
      address: { type: "string", max: 200 },
      services: { type: "list", maxItems: 50, max: 150 },
      // How far around this area the company/freelancer travels (drawn as a dotted circle on the map).
      radius: { type: "number", min: 0, max: 500 },
      latitude: { type: "number", min: -90, max: 90 },
      longitude: { type: "number", min: -180, max: 180 },
    },
  },
};

/** Latitude and longitude only make sense together. */
export function validateServiceAreas(values, { partial } = {}) {
  const hasLat = values.latitude !== undefined && values.latitude !== null;
  const hasLng = values.longitude !== undefined && values.longitude !== null;
  if (!partial && hasLat !== hasLng) return { [hasLat ? "longitude" : "latitude"]: "is required with the other coordinate" };
  return {};
}

const unique = (names) => [...new Set(names.map((name) => name.trim()).filter(Boolean))].slice(0, 200);

/**
 * Keeps the three views of the areas consistent: `areaDetails` (one row per area), `areas`
 * (names, used by search and the public listing), and `areasCovered` (the comma-separated text).
 */
export async function normalizeServiceAreas(values) {
  if ("areaDetails" in values) {
    const seen = new Set();
    values.areaDetails = (values.areaDetails ?? []).filter((area) => !seen.has(area.name.toLowerCase()) && seen.add(area.name.toLowerCase()));
    values.areas = unique(values.areaDetails.map((area) => area.name));
    values.areasCovered = values.areas.join(", ");
    // Real coordinates for each area (so the map can draw its radius); areas that can't be found keep none.
    const state = stateOf(values.branchLocation);
    // One at a time: the address search service allows about one request per second.
    for (const area of values.areaDetails) {
      if (Number.isFinite(area.latitude) && Number.isFinite(area.longitude)) continue;
      const place = await locateArea(area.name, state, area.address);
      if (place) Object.assign(area, { latitude: place.latitude, longitude: place.longitude });
    }
  } else if ("areasCovered" in values) {
    values.areas = unique((values.areasCovered ?? "").split(","));
    values.areaDetails = values.areas.map((name) => ({ name, services: [] }));
  }
}

// Mongoose fields for the stored record.
export const serviceAreaSchemaFields = {
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
  areaDetails: { type: [{ _id: false, name: { type: String, trim: true }, address: { type: String, trim: true }, services: [{ type: String, trim: true }], radius: Number, latitude: Number, longitude: Number }], default: [] },
};
