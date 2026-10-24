import { isUsZip, placeLookup } from "../../../location/services/placeLookup.js";

/**
 * Customer signup needs a real US ZIP code. The city, state, and coordinates come from the
 * ZIP lookup, never from the request, so the saved location is always a real place.
 */
export async function validateUserLocation(req, res, next) {
  try {
    const zipCode = typeof req.body?.zipCode === "string" ? req.body.zipCode.trim() : "";
    if (!isUsZip(zipCode)) return res.status(400).json({ message: "Enter your 5-digit US ZIP code." });
    const place = await placeLookup.zip(zipCode);
    if (!place) return res.status(400).json({ message: "We couldn't find that ZIP code. Please check it." });
    Object.assign(req.body, { zipCode: place.zipCode, city: place.city, state: place.stateCode || place.state, latitude: place.latitude, longitude: place.longitude });
    next();
  } catch (error) { next(error); }
}
