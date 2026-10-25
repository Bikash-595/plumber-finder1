import { placeLookup } from "./placeLookup.js";

// "Round Rock" + base "Austin, TX" -> look up Round Rock, TX. "Los Angeles, CA" carries its own state.
export function splitPlace(name, fallbackState = "") {
  const match = String(name ?? "").trim().match(/^(.*?),\s*([A-Za-z]{2})$/);
  if (match) return { city: match[1].trim(), stateCode: match[2].toUpperCase() };
  return { city: String(name ?? "").trim(), stateCode: String(fallbackState ?? "").trim().toUpperCase() };
}

/** The state code at the end of a base location like "Austin, TX" (or ""). */
export const stateOf = (location) => String(location ?? "").match(/,\s*([A-Za-z]{2})\s*$/)?.[1]?.toUpperCase() ?? "";

/**
 * Coordinates for an area: its own address when given ("1100 Congress Ave, Austin, TX"), otherwise
 * its name as a city ("Round Rock" in the base state). null when it can't be found or the service is down.
 */
export async function locateArea(name, fallbackState, address) {
  try {
    if (address?.trim()) {
      const found = await placeLookup.search(address.trim());
      if (found) return found;
    }
    const { city, stateCode } = splitPlace(name, fallbackState);
    return await placeLookup.city(city, stateCode);
  } catch {
    return null;
  }
}
