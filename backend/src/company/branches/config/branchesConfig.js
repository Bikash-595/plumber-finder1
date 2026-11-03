// Other offices or depots: each with its address, manager, contact details, services and hours.
const phone = { type: "string", max: 40, pattern: /^[+()\d\s.-]{7,40}$/, patternMessage: "must be a phone number" };

export const branchesConfig = {
  label: "Branch",
  labelPlural: "branches",
  maxItems: 50,
  fields: {
    name: { type: "string", required: true, max: 120 },
    manager: { type: "string", max: 120 },
    address: { type: "string", max: 300 },
    city: { type: "string", max: 120 },
    state: { type: "string", max: 120 },
    zipCode: { type: "string", max: 20 },
    phone,
    email: { type: "string", max: 200, pattern: /^\S+@\S+\.\S+$/, patternMessage: "must be a valid email" },
    latitude: { type: "number", min: -90, max: 90 },
    longitude: { type: "number", min: -180, max: 180 },
    services: { type: "list", maxItems: 30, max: 120 },
    hours: { type: "string", max: 200 },
  },
};
