import { isUsZip, placeLookup } from "../services/placeLookup.js";
import { locateArea } from "../services/areaPlace.js";

/** GET /api/location/zip/:zip — the city and state for a US ZIP code. */
export async function lookupZip(req, res, next) {
  try {
    if (!isUsZip(req.params.zip)) return res.status(400).json({ message: "Enter a 5-digit US ZIP code." });
    const place = await placeLookup.zip(req.params.zip.trim());
    if (!place) return res.status(404).json({ message: "We couldn't find that ZIP code." });
    res.json({ data: place });
  } catch (error) { next(error); }
}

/** GET /api/location/reverse?lat=..&lng=.. — the ZIP code, city, and state at the visitor's location. */
export async function reverseLookup(req, res, next) {
  try {
    const latitude = Number(req.query.lat), longitude = Number(req.query.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      return res.status(400).json({ message: "lat and lng must be valid coordinates." });
    }
    const place = await placeLookup.reverse(latitude.toFixed(5), longitude.toFixed(5));
    if (!place) return res.status(404).json({ message: "We couldn't find a US ZIP code at your location. Please type it instead." });
    res.json({ data: place });
  } catch (error) { next(error); }
}

/**
 * GET /api/location/place?name=Round%20Rock&state=TX[&address=...] — where a service area is: its
 * address when given, otherwise the centre of the city or town (for service-area maps).
 */
export async function lookupPlace(req, res, next) {
  try {
    const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
    const state = typeof req.query.state === "string" ? req.query.state.trim() : "";
    const address = typeof req.query.address === "string" ? req.query.address.trim() : "";
    if ((!name && !address) || name.length > 120 || address.length > 200) return res.status(400).json({ message: "name or address is required." });
    const place = await locateArea(name, state, address);
    if (!place) return res.status(404).json({ message: "We couldn't find that place. Add the state, e.g. \"Round Rock, TX\"." });
    res.json({ data: place });
  } catch (error) { next(error); }
}
