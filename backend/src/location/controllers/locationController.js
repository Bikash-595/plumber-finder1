import { isUsZip, placeLookup } from "../services/placeLookup.js";

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
