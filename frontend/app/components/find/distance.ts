import type { Plumber } from "./types";

export type Point = { lat: number; lng: number };

// City centres for plumbers that only list a city (approximate distances). Keys: "city, ST" in lowercase.
const cityCentres: Record<string, Point> = {
  "new york, ny": { lat: 40.7128, lng: -74.006 }, "los angeles, ca": { lat: 34.0522, lng: -118.2437 }, "chicago, il": { lat: 41.8781, lng: -87.6298 },
  "houston, tx": { lat: 29.7604, lng: -95.3698 }, "phoenix, az": { lat: 33.4484, lng: -112.074 }, "philadelphia, pa": { lat: 39.9526, lng: -75.1652 },
  "san antonio, tx": { lat: 29.4241, lng: -98.4936 }, "san diego, ca": { lat: 32.7157, lng: -117.1611 }, "dallas, tx": { lat: 32.7767, lng: -96.797 },
  "austin, tx": { lat: 30.2672, lng: -97.7431 }, "jacksonville, fl": { lat: 30.3322, lng: -81.6557 }, "fort worth, tx": { lat: 32.7555, lng: -97.3308 },
  "san jose, ca": { lat: 37.3382, lng: -121.8863 }, "columbus, oh": { lat: 39.9612, lng: -82.9988 }, "charlotte, nc": { lat: 35.2271, lng: -80.8431 },
  "indianapolis, in": { lat: 39.7684, lng: -86.1581 }, "san francisco, ca": { lat: 37.7749, lng: -122.4194 }, "seattle, wa": { lat: 47.6062, lng: -122.3321 },
  "denver, co": { lat: 39.7392, lng: -104.9903 }, "washington, dc": { lat: 38.9072, lng: -77.0369 }, "boston, ma": { lat: 42.3601, lng: -71.0589 },
  "nashville, tn": { lat: 36.1627, lng: -86.7816 }, "detroit, mi": { lat: 42.3314, lng: -83.0458 }, "portland, or": { lat: 45.5152, lng: -122.6784 },
  "las vegas, nv": { lat: 36.1699, lng: -115.1398 }, "memphis, tn": { lat: 35.1495, lng: -90.049 }, "louisville, ky": { lat: 38.2527, lng: -85.7585 },
  "baltimore, md": { lat: 39.2904, lng: -76.6122 }, "milwaukee, wi": { lat: 43.0389, lng: -87.9065 }, "albuquerque, nm": { lat: 35.0844, lng: -106.6504 },
  "tucson, az": { lat: 32.2226, lng: -110.9747 }, "fresno, ca": { lat: 36.7378, lng: -119.7871 }, "sacramento, ca": { lat: 38.5816, lng: -121.4944 },
  "atlanta, ga": { lat: 33.749, lng: -84.388 }, "miami, fl": { lat: 25.7617, lng: -80.1918 }, "orlando, fl": { lat: 28.5383, lng: -81.3792 },
  "tampa, fl": { lat: 27.9506, lng: -82.4572 }, "minneapolis, mn": { lat: 44.9778, lng: -93.265 }, "cleveland, oh": { lat: 41.4993, lng: -81.6944 },
  "kansas city, mo": { lat: 39.0997, lng: -94.5786 }, "st. louis, mo": { lat: 38.627, lng: -90.1994 }, "pittsburgh, pa": { lat: 40.4406, lng: -79.9959 },
  "salt lake city, ut": { lat: 40.7608, lng: -111.891 }, "raleigh, nc": { lat: 35.7796, lng: -78.6382 }, "oklahoma city, ok": { lat: 35.4676, lng: -97.5164 },
  "new orleans, la": { lat: 29.9511, lng: -90.0715 }, "plano, tx": { lat: 33.0198, lng: -96.6989 }, "round rock, tx": { lat: 30.5083, lng: -97.6789 },
  "albany, ny": { lat: 42.6526, lng: -73.7562 }, "brooklyn, ny": { lat: 40.6782, lng: -73.9442 },
};
const stateNames: Record<string, string> = { texas: "tx", california: "ca", "new york": "ny", illinois: "il", arizona: "az", pennsylvania: "pa", florida: "fl", ohio: "oh", "north carolina": "nc", indiana: "in", washington: "wa", colorado: "co", massachusetts: "ma", tennessee: "tn", michigan: "mi", oregon: "or", nevada: "nv", kentucky: "ky", maryland: "md", wisconsin: "wi", "new mexico": "nm", georgia: "ga", minnesota: "mn", missouri: "mo", utah: "ut", oklahoma: "ok", louisiana: "la" };

function cityCentre(city?: string, state?: string): Point | undefined {
  if (!city) return undefined;
  const st = (state ?? "").trim().toLowerCase();
  return cityCentres[`${city.trim().toLowerCase()}, ${stateNames[st] ?? st}`];
}

/** Where a plumber is: exact coordinates when known, otherwise its city centre (approximate). */
export function plumberPoint(plumber: Plumber): { point: Point; approximate: boolean } | null {
  if (plumber.coordinates) return { point: plumber.coordinates, approximate: false };
  const branch = plumber.branches?.find((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  if (branch) return { point: { lat: branch.lat, lng: branch.lng }, approximate: false };
  const [cityPart, statePart] = (plumber.location ?? "").split(",").map((part) => part.trim());
  const centre = cityCentre(plumber.city ?? cityPart, plumber.state ?? statePart);
  return centre ? { point: centre, approximate: true } : null;
}

/** Great-circle distance in miles. */
export function milesBetween(a: Point, b: Point): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

/** "2.4 mi away" / "~35 mi away" from the visitor, or null when either location is unknown. */
export function distanceLabel(plumber: Plumber, from: Point | null): string | null {
  if (!from) return null;
  const where = plumberPoint(plumber);
  if (!where) return null;
  const miles = milesBetween(from, where.point);
  const value = miles < 10 ? miles.toFixed(1) : Math.round(miles).toLocaleString("en-US");
  return `${where.approximate ? "~" : ""}${value} mi away`;
}
