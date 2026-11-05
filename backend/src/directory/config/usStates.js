// The 50 US states and the District of Columbia: USPS code, name and URL slug ("new-hampshire").
// Directory pages and search use these; cities come from usCities.js and from real listings.

export const US_STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"],
  ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"],
  ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"],
  ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"],
  ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
].map(([code, name]) => ({ code, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }));

export const stateByCode = new Map(US_STATES.map((state) => [state.code, state]));
export const stateBySlug = new Map(US_STATES.map((state) => [state.slug, state]));
const stateByName = new Map(US_STATES.map((state) => [state.name.toLowerCase(), state]));

/** "TX", "tx", "Texas", "texas" or "new-hampshire" → the state, or null. */
export function findState(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (/^[A-Za-z]{2}$/.test(text)) return stateByCode.get(text.toUpperCase()) ?? null;
  const lower = text.toLowerCase().replace(/\s+/g, " ");
  return stateByName.get(lower) ?? stateBySlug.get(lower) ?? (lower === "washington dc" || lower === "washington d.c." ? stateByCode.get("DC") : null) ?? null;
}
