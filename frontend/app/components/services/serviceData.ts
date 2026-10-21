export type ServiceDefinition = {
  slug: string;
  filter: string;
  name: string;
  /** Short line used in the navbar services menu. */
  tagline: string;
  /** Company service/specialization names (case-insensitive) that count as offering this service. */
  matches: string[];
  seoTitle: string;
  seoDescription: string;
  intro: string;
  signs: string[];
  process: string[];
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    slug: "emergency-plumbing",
    tagline: "24/7 help for burst pipes and floods",
    matches: ["Emergency Service","Emergency Plumbing","Emergency","24/7"],
    filter: "Emergency Service",
    name: "Emergency Plumbing",
    seoTitle: "Emergency Plumbing Services Near You",
    seoDescription:
      "Compare local emergency plumbers for burst pipes, active leaks, overflowing fixtures, and urgent plumbing repairs.",
    intro:
      "Get connected with local emergency plumbers when an active leak, overflow, or loss of water needs immediate attention.",
    signs: [
      "Burst or actively leaking pipes",
      "Overflowing toilets or drains",
      "No running water or sewage backup",
    ],
    process: [
      "Describe the emergency and affected fixtures",
      "Compare available local plumbers",
      "Arrange urgent repair and receive next-step guidance",
    ],
  },

  {
    slug: "drain-cleaning",
    tagline: "Clear slow, blocked, and recurring clogs",
    matches: ["Drain Cleaning","Drain Snaking","Clog Removal","Hydro Jetting"],
    filter: "Drain Cleaning",
    name: "Drain Cleaning",
    seoTitle: "Drain Cleaning Plumbers Near You",
    seoDescription:
      "Find drain cleaning plumbers for clogged sinks, showers, toilets, and main sewer lines.",
    intro:
      "Find drain cleaning specialists for slow, blocked, or recurring drain problems in your home or business.",
    signs: [
      "Slow or backed-up drains",
      "Recurring clogs in the same fixture",
      "Gurgling sounds or unpleasant drain odors",
    ],
    process: [
      "Share which drains are affected",
      "Compare cleaning and inspection options",
      "Book service with a qualified local plumber",
    ],
  },

  {
    slug: "water-heater-repair",
    tagline: "Tank and tankless repair or replacement",
    matches: ["Water Heater","Tankless"],
    filter: "Water Heater",
    name: "Water Heater Repair",
    seoTitle: "Water Heater Repair and Replacement Near You",
    seoDescription:
      "Compare plumbers for tank and tankless water heater repair, replacement, installation, and maintenance.",
    intro:
      "Compare plumbers for water heater diagnosis, repair, maintenance, and energy-efficient replacement options.",
    signs: [
      "No hot water or inconsistent temperature",
      "Leaking tank or unusual sounds",
      "Rusty water or visible corrosion",
    ],
    process: [
      "Tell the plumber your heater type and symptoms",
      "Review repair versus replacement options",
      "Schedule a safe professional inspection",
    ],
  },

  {
    slug: "leak-detection",
    tagline: "Find hidden leaks before they spread",
    matches: ["Leak Detection","Leak Repair"],
    filter: "Leak Detection",
    name: "Leak Detection",
    seoTitle: "Leak Detection Specialists Near You",
    seoDescription:
      "Find local plumbers for hidden water leak detection, pipe testing, slab leak investigation, and repair.",
    intro:
      "Locate hidden plumbing leaks before they cause further water damage, mold growth, or unnecessary utility costs.",
    signs: [
      "Unexplained increase in water bills",
      "Damp walls, floors, or ceilings",
      "Running-water sounds with fixtures off",
    ],
    process: [
      "Document visible moisture or meter changes",
      "Compare plumbers with leak-location expertise",
      "Receive repair recommendations after diagnosis",
    ],
  },

  {
    slug: "pipe-repair",
    tagline: "Fix leaking, corroded, or burst pipes",
    matches: ["Pipe Repair","Repiping","Leak Repair"],
    filter: "Pipe Repair",
    name: "Pipe Repair",
    seoTitle: "Pipe Repair and Repiping Near You",
    seoDescription:
      "Compare local plumbers for leaking pipe repair, burst pipes, corroded plumbing, repiping, and water-pressure problems.",
    intro:
      "Find qualified plumbers for damaged pipes, corrosion, leaks, low water pressure, and repiping projects.",
    signs: [
      "Visible leaks or corroded pipes",
      "Reduced water pressure",
      "Frequent repairs on older plumbing",
    ],
    process: [
      "Isolate active leaks if it is safe",
      "Explain the pipe material and affected area",
      "Compare repair and replacement recommendations",
    ],
  },

  {
    slug: "bathroom-plumbing",
    tagline: "Toilets, faucets, showers, and fixtures",
    matches: ["Toilet Repair","Faucet Installation","Fixture Installation","Bathroom","Shower"],
    filter: "Toilet Repair",
    name: "Bathroom Plumbing",
    seoTitle: "Bathroom Plumbing and Toilet Repair Near You",
    seoDescription:
      "Find plumbers for toilet repair, bathroom leaks, shower plumbing, faucet repairs, fixture installation, and drain problems.",
    intro:
      "Compare local bathroom plumbers for toilets, faucets, showers, fixtures, leaks, and drain issues.",
    signs: [
      "Toilet leaks, clogs, or constant running",
      "Dripping faucets or low shower pressure",
      "Bathroom drain backups or odors",
    ],
    process: [
      "Identify the fixture and symptoms",
      "Compare repair or fixture replacement options",
      "Book a plumber suited to your bathroom project",
    ],
  },

  {
    slug: "sewer-line-service",
    tagline: "Backups, camera inspection, and repair",
    matches: ["Sewer","Video Inspection","Hydro Jetting"],
    filter: "Sewer Line",
    name: "Sewer Line Service",
    seoTitle: "Sewer Line Service and Repair Near You",
    seoDescription:
      "Find sewer line plumbers for backups, camera inspections, cleaning, repair, and replacement.",
    intro:
      "Find sewer line specialists for multiple drain backups, inspections, cleaning, and repair options.",
    signs: [
      "Several drains back up together",
      "Sewage in tubs, showers, or floor drains",
      "Sewer odors or damp areas outdoors",
    ],
    process: [
      "Avoid using affected fixtures",
      "Ask about camera inspection and diagnosis",
      "Compare cleaning, repair, and replacement options",
    ],
  },

  {
    slug: "commercial-plumbing",
    tagline: "Plumbing for businesses and facilities",
    matches: ["Commercial"],
    filter: "Commercial Plumbing",
    name: "Commercial Plumbing",
    seoTitle: "Commercial Plumbing Services Near You",
    seoDescription:
      "Compare commercial plumbers for business repairs, maintenance, fixture upgrades, drain service, and code-compliant plumbing work.",
    intro:
      "Connect with commercial plumbing professionals who can help keep your business, property, or facility operating reliably.",
    signs: [
      "A plumbing issue disrupts business operations",
      "You need planned maintenance or inspection",
      "A renovation requires new plumbing fixtures",
    ],
    process: [
      "Share property type and access requirements",
      "Compare response time and maintenance options",
      "Schedule work around your operating hours",
    ],
  },

  {
    slug: "hydro-jetting",
    tagline: "High-pressure cleaning for drains and sewers",
    matches: ["Hydro Jetting", "Jetting"],
    filter: "Hydro Jetting",
    name: "Hydro Jetting",
    seoTitle: "Hydro Jetting Services Near You",
    seoDescription:
      "Compare local plumbers for hydro jetting of grease, roots, scale, and stubborn buildup in drains and sewer lines.",
    intro:
      "Find plumbers who use high-pressure water jetting to clear heavy buildup that snaking alone cannot remove.",
    signs: [
      "Clogs that return soon after snaking",
      "Grease or scale buildup in kitchen or main lines",
      "Tree roots found during a camera inspection",
    ],
    process: [
      "Ask whether a camera inspection is recommended first",
      "Confirm your pipe material and age",
      "Compare jetting quotes and follow-up maintenance options",
    ],
  },

  {
    slug: "garbage-disposal",
    tagline: "Disposal repair, replacement, and installs",
    matches: ["Garbage Disposal", "Disposal"],
    filter: "Garbage Disposal",
    name: "Garbage Disposal",
    seoTitle: "Garbage Disposal Repair and Installation Near You",
    seoDescription:
      "Find plumbers for jammed, leaking, or noisy garbage disposals, plus new disposal installation and replacement.",
    intro:
      "Compare local plumbers for garbage disposal repairs, replacements, and new kitchen installations.",
    signs: [
      "Disposal hums but does not spin",
      "Leaks under the kitchen sink",
      "Frequent jams, resets, or bad odors",
    ],
    process: [
      "Turn off power to the unit before inspecting",
      "Note the brand, model, and symptoms",
      "Compare repair versus replacement options",
    ],
  },

  {
    slug: "sump-pump",
    tagline: "Basement flood protection and pump repair",
    matches: ["Sump Pump", "Pump Systems"],
    filter: "Sump Pump",
    name: "Sump Pump",
    seoTitle: "Sump Pump Repair and Installation Near You",
    seoDescription:
      "Compare plumbers for sump pump installation, repair, battery backups, and basement flood prevention.",
    intro:
      "Find plumbers who install, repair, and maintain sump pumps to keep basements and crawl spaces dry.",
    signs: [
      "Pump runs constantly or not at all",
      "Water collecting in the basement or pit",
      "Loud grinding or rattling during operation",
    ],
    process: [
      "Check the float switch and power supply if safe",
      "Share basement size and past flooding history",
      "Ask about backup pumps and alarms",
    ],
  },

  {
    slug: "water-softener",
    tagline: "Softeners, filtration, and water treatment",
    matches: ["Water Softener", "Water Systems", "Water Filtration", "Water Treatment"],
    filter: "Water Softener",
    name: "Water Softener",
    seoTitle: "Water Softener and Filtration Installation Near You",
    seoDescription:
      "Find plumbers for water softener installation, whole-home filtration, and hard-water treatment systems.",
    intro:
      "Compare plumbers who install and service water softeners and filtration systems for cleaner, softer water.",
    signs: [
      "Scale buildup on fixtures and appliances",
      "Spotty dishes or dry skin and hair",
      "Unusual taste, color, or odor in tap water",
    ],
    process: [
      "Test your water hardness or quality",
      "Compare softener and filtration system options",
      "Schedule installation and ongoing maintenance",
    ],
  },
];

export const serviceBySlug = Object.fromEntries(
  serviceDefinitions.map((service) => [service.slug, service]),
);

type ServiceProvider = { services: string[]; specializations?: string[]; isEmergency?: boolean };

/** True when a company lists a service or specialization matching this service type. */
export function offersService(company: ServiceProvider, service: ServiceDefinition) {
  if (service.slug === "emergency-plumbing" && company.isEmergency) return true;
  const terms = [service.filter, service.name, ...service.matches].map((term) => term.toLowerCase());
  return [...company.services, ...(company.specializations ?? [])].some((offered) => {
    const value = offered.trim().toLowerCase();
    return terms.some((term) => value === term || value.includes(term));
  });
}
