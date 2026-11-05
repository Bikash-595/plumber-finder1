// The services directory pages rank by. Slugs match the website's /services/<slug> pages
// (frontend components/services/serviceData.ts); `matches` are the service names providers list that count.
// `urlNoun` makes the ranking URL: /top-10-<urlNoun>/<state> (e.g. /top-10-drain-cleaning-companies/texas).

export const DIRECTORY_SERVICES = [
  { slug: "emergency-plumbing", name: "Emergency Plumbing", noun: "Emergency Plumbers", urlNoun: "emergency-plumbers", keywords: ["emergency", "24/7", "24 7", "urgent", "burst pipe"], matches: ["emergency service", "emergency plumbing", "emergency", "24/7"] },
  { slug: "drain-cleaning", name: "Drain Cleaning", noun: "Drain Cleaning Companies", urlNoun: "drain-cleaning-companies", keywords: ["drain", "clog", "unclog", "blocked drain"], matches: ["drain cleaning", "drain", "clog"] },
  { slug: "water-heater-repair", name: "Water Heater Repair", noun: "Water Heater Repair Companies", urlNoun: "water-heater-repair-companies", keywords: ["water heater", "hot water", "tankless", "boiler"], matches: ["water heater", "tankless", "hot water"] },
  { slug: "leak-detection", name: "Leak Detection", noun: "Leak Detection Companies", urlNoun: "leak-detection-companies", keywords: ["leak detection", "leak repair", "leak", "leaking"], matches: ["leak detection", "leak repair", "leak"] },
  { slug: "pipe-repair", name: "Pipe Repair", noun: "Pipe Repair Companies", urlNoun: "pipe-repair-companies", keywords: ["pipe repair", "pipe", "repipe", "repiping"], matches: ["pipe repair", "pipe", "repipe", "repiping"] },
  { slug: "bathroom-plumbing", name: "Bathroom Plumbing", noun: "Bathroom Plumbers", urlNoun: "bathroom-plumbers", keywords: ["bathroom", "toilet", "shower", "faucet"], matches: ["bathroom", "toilet", "shower", "faucet"] },
  { slug: "sewer-line-service", name: "Sewer Line Service", noun: "Sewer Line Companies", urlNoun: "sewer-line-companies", keywords: ["sewer", "septic", "main line"], matches: ["sewer", "septic"] },
  { slug: "commercial-plumbing", name: "Commercial Plumbing", noun: "Commercial Plumbers", urlNoun: "commercial-plumbers", keywords: ["commercial", "business plumbing", "restaurant"], matches: ["commercial"] },
  { slug: "hydro-jetting", name: "Hydro Jetting", noun: "Hydro Jetting Companies", urlNoun: "hydro-jetting-companies", keywords: ["hydro jetting", "hydro-jetting", "jetting"], matches: ["hydro jetting", "hydro-jetting", "jetting"] },
  { slug: "garbage-disposal", name: "Garbage Disposal", noun: "Garbage Disposal Companies", urlNoun: "garbage-disposal-companies", keywords: ["garbage disposal", "disposal"], matches: ["garbage disposal", "disposal"] },
  { slug: "sump-pump", name: "Sump Pump", noun: "Sump Pump Companies", urlNoun: "sump-pump-companies", keywords: ["sump pump", "sump"], matches: ["sump pump", "sump"] },
  { slug: "water-softener", name: "Water Softener", noun: "Water Softener Companies", urlNoun: "water-softener-companies", keywords: ["water softener", "softener", "water filtration", "water treatment"], matches: ["water softener", "softener", "filtration", "water treatment"] },
];

export const serviceBySlug = new Map(DIRECTORY_SERVICES.map((service) => [service.slug, service]));
export const serviceByUrlNoun = new Map(DIRECTORY_SERVICES.map((service) => [service.urlNoun, service]));

/** True when a provider's listed services include this one (or it is an emergency provider and the service is emergency). */
export function offersService(entry, service) {
  if (!service) return true;
  if (service.slug === "emergency-plumbing" && entry.isEmergency) return true;
  return entry.serviceNames.some((name) => service.matches.some((term) => name === term || name.includes(term)));
}
