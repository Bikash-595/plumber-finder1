// A customer's saved service addresses (home, a rental, a parent's house …) with the property details
// a plumber needs before a visit. One is the default; it pre-fills booking and checkout forms.
export const PROPERTY_TYPES = ["house", "apartment", "condo", "townhouse", "mobile_home", "commercial", "other"];
export const OWNERSHIP = ["owner", "renter", "landlord", "property_manager"];

export const addressesConfig = {
  label: "Address",
  labelPlural: "addresses",
  maxItems: 5,
  fields: {
    label: { type: "string", required: true, max: 40 },
    line1: { type: "string", required: true, max: 150 },
    line2: { type: "string", max: 100 },
    city: { type: "string", required: true, max: 100 },
    state: { type: "string", required: true, max: 60 },
    zipCode: { type: "string", required: true, max: 10, pattern: /^\d{5}(-\d{4})?$/, patternMessage: "must be a 5-digit ZIP code" },
    propertyType: { type: "enum", values: PROPERTY_TYPES },
    ownership: { type: "enum", values: OWNERSHIP },
    yearBuilt: { type: "number", integer: true, min: 1800, max: () => new Date().getUTCFullYear() },
    // Gate codes, parking, pets, where the water shut-off is …
    accessNotes: { type: "text", max: 500 },
    isDefault: { type: "boolean", default: false },
  },
};

/** "12 Oak St, Apt 4, Austin, TX 78701" */
export const formatAddress = ({ line1, line2, city, state, zipCode }) => [line1, line2, city, [state, zipCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
