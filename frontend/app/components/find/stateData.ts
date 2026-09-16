import { states } from "@/components/utils/location";

export type StateSeoCopy = {
  title: string;
  description: string;
  services: string[];
  areas: string[];
  bookingChecklist: string[];
  eyebrow: string;
  servicesHeading: string;
  areasHeading: string;
  bookingHeading: string;
  emergencyMessage: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  disclaimer: string;
};

const defaultServices = [
  "General plumbing repairs",
  "Drain cleaning",
  "Leak detection and repair",
  "Water heater service",
  "Toilet and fixture repair",
  "Pipe repair and replacement",
];

const defaultChecklist = [
  "Describe the plumbing issue and when it started",
  "Check that the company serves your address",
  "Compare reviews, services, and availability",
  "Confirm pricing and appointment details before booking",
];

const createStateContent = (stateName: string): StateSeoCopy => ({
  title: `Find trusted plumbers in ${stateName}`,
  description: `Compare local plumbing companies across ${stateName} for repairs, maintenance, installations, and urgent plumbing needs.`,
  services: defaultServices,
  areas: [`Communities across ${stateName}`, `Homes and businesses throughout ${stateName}`],
  bookingChecklist: defaultChecklist,
  eyebrow: "Local plumbing guide",
  servicesHeading: "Services available",
  areasHeading: `Areas served in ${stateName}`,
  bookingHeading: "Before you book",
  emergencyMessage: "Call first to confirm same-day or emergency availability",
  ctaTitle: `Need a plumber in ${stateName}?`,
  ctaDescription: "Review local company profiles and request quotes for your plumbing project.",
  ctaLabel: "Request free quotes",
  disclaimer: "Service availability, pricing, response times, and repair requirements may vary by location and provider. Confirm details directly with the plumbing company before booking.",
});

/**
 * SEO copy for all 50 states. Add or edit a state here when it needs bespoke copy.
 */
export const STATE_SEO_CONTENT: Record<string, StateSeoCopy> = Object.fromEntries(
  Object.values(states).map((stateName) => [stateName, createStateContent(stateName)])
) as Record<string, StateSeoCopy>;

/**
 * City-specific overrides for cities currently listed in the plumber directory.
 * New city copy can be added here without changing the SEO component.
 */
export const CITY_SEO_CONTENT: Record<string, Record<string, StateSeoCopy>> = {
  Arizona: {
    Phoenix: {
      ...createStateContent("Arizona"),
      title: "Find trusted plumbers in Phoenix, Arizona",
      description: "Compare Phoenix plumbing companies for home repairs, drain cleaning, water heater service, and urgent plumbing needs.",
      areas: ["Phoenix neighborhoods", "Nearby Maricopa County communities"],
    },
  },
  California: {
    "Los Angeles": {
      ...createStateContent("California"),
      title: "Find trusted plumbers in Los Angeles, California",
      description: "Compare Los Angeles plumbing companies for repairs, maintenance, fixture installations, and emergency plumbing service.",
      areas: ["Los Angeles neighborhoods", "Nearby Los Angeles County communities"],
    },
  },
  Illinois: {
    Chicago: {
      ...createStateContent("Illinois"),
      title: "Find trusted plumbers in Chicago, Illinois",
      description: "Compare Chicago plumbing companies for drain cleaning, leak repairs, water heater work, and routine maintenance.",
      areas: ["Chicago neighborhoods", "Nearby Cook County communities"],
    },
  },
  "New York": {
    "New York": {
      ...createStateContent("New York"),
      title: "Find trusted plumbers in New York, New York",
      description: "Compare New York plumbing companies for repairs, installations, drain service, and urgent plumbing problems.",
      areas: ["New York City neighborhoods", "Nearby New York communities"],
    },
  },
  Pennsylvania: {
    Philadelphia: {
      ...createStateContent("Pennsylvania"),
      title: "Find trusted plumbers in Philadelphia, Pennsylvania",
      description: "Compare Philadelphia plumbing companies for repairs, maintenance, drain cleaning, and water heater service.",
      areas: ["Philadelphia neighborhoods", "Nearby Philadelphia County communities"],
    },
  },
  Texas: {
    Dallas: {
      ...createStateContent("Texas"),
      title: "Find trusted plumbers in Dallas, Texas",
      description: "Compare Dallas plumbing companies for repairs, drain cleaning, leak detection, and emergency plumbing needs.",
      areas: ["Dallas neighborhoods", "Nearby Dallas County communities"],
    },
    Houston: {
      ...createStateContent("Texas"),
      title: "Find trusted plumbers in Houston, Texas",
      description: "Compare Houston plumbing companies for repairs, water heater service, pipe work, and urgent plumbing problems.",
      areas: ["Houston neighborhoods", "Nearby Harris County communities"],
    },
    "San Antonio": {
      ...createStateContent("Texas"),
      title: "Find trusted plumbers in San Antonio, Texas",
      description: "Compare San Antonio plumbing companies for fixture repairs, drain service, leak detection, and maintenance.",
      areas: ["San Antonio neighborhoods", "Nearby Bexar County communities"],
    },
  },
  Washington: {
    Seattle: {
      ...createStateContent("Washington"),
      title: "Find trusted plumbers in Seattle, Washington",
      description: "Compare Seattle plumbing companies for home repairs, drain cleaning, water heater work, and emergency service.",
      areas: ["Seattle neighborhoods", "Nearby King County communities"],
    },
  },
};

export function getStateSeoContent(stateName: string, city?: string): StateSeoCopy {
  if (city && CITY_SEO_CONTENT[stateName]?.[city]) {
    return CITY_SEO_CONTENT[stateName][city];
  }

  if (city) {
    return {
      ...createStateContent(stateName),
      title: `Find trusted plumbers in ${city}, ${stateName}`,
      description: `Compare local plumbing companies in ${city}, ${stateName} for repairs, maintenance, installations, and urgent plumbing needs.`,
      areas: [`${city} neighborhoods`, `Nearby ${stateName} communities`],
      areasHeading: `Areas served in ${city}, ${stateName}`,
      ctaTitle: `Need a plumber in ${city}, ${stateName}?`,
    };
  }

  return STATE_SEO_CONTENT[stateName] ?? createStateContent(stateName);
}
