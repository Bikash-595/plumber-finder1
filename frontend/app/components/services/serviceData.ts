export type ServiceDefinition = {
  slug: string;
  filter: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  signs: string[];
  process: string[];
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    slug: "emergency-plumbing",
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
];

export const serviceBySlug = Object.fromEntries(
  serviceDefinitions.map((service) => [service.slug, service]),
);
