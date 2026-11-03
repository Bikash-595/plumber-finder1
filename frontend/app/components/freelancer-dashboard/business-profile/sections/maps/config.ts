import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// Where you're based, your map pin and how far you travel.
// Saved to /api/freelancers/location.
export const mapsConfig = {
  section: "freelancer-maps",
  apiEndpoint: "/freelancers/location",
  title: "Google Maps",
  description: "Where you're based and how far you travel. The coordinates place your pin on the map.",
  defaults: { headquarters: "Dallas, TX", latitude: "32.7767", longitude: "-96.7970", serviceRadius: "20", mapUrl: "" },
  fields: [
    { name: "headquarters", label: "Based in (address or area)" },
    { name: "mapUrl", label: "Google Maps Link", type: "url" },
    { name: "latitude", label: "Latitude", type: "number", placeholder: "e.g. 32.7767 — right-click your location in Google Maps to copy it" },
    { name: "longitude", label: "Longitude", type: "number", placeholder: "e.g. -96.7970" },
    { name: "serviceRadius", label: "Travel Radius (miles)", type: "number" },
  ] satisfies ProfileField[],
};
