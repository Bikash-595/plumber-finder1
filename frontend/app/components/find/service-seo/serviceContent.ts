type ServiceContent = {
  title: string;
  description: string;

  /**
   * Column 1
   * Services related to this category
   */
  services: string[];

  /**
   * Column 2
   * Situations when customer should contact a plumber
   */
  whenToCall: string[];

  /**
   * Column 3
   * Things customer should know/do before appointment
   */
  checklist: string[];
};


/* =========================================================
   SERVICE CONTENT
========================================================= */

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  /* =======================================================
     EMERGENCY SERVICE
  ======================================================= */

  "Emergency Service": {
    title: "Emergency plumbing services near you",

    description:
      "Get fast help when a plumbing problem threatens your home, property, or water supply. Compare local professionals for urgent plumbing repairs and emergency service.",

    services: [
      "Burst pipe repair",
      "Emergency water leak repair",
      "Overflowing toilet assistance",
      "Emergency drain clearing",
      "Water supply problems",
      "Sewer and plumbing emergencies",
      "Emergency fixture repair",
      "After-hours plumbing service",
    ],

    whenToCall: [
      "A pipe has burst or is actively leaking",
      "A toilet or drain is overflowing",
      "Water is spreading across floors or walls",
      "You suddenly lose running water",
      "You notice a serious sewage problem",
      "A plumbing problem is causing property damage",
      "A fixture cannot be safely used",
    ],

    checklist: [
      "Turn off the nearest water supply when safe",
      "Move furniture and valuables away from water",
      "Take photos or videos of visible damage",
      "Tell the plumber what happened",
      "Explain when the problem first started",
      "Mention previous plumbing repairs",
      "Ask about emergency response time",
    ],
  },


  /* =======================================================
     DRAIN CLEANING
  ======================================================= */

  "Drain Cleaning": {
    title: "Drain cleaning plumbers near you",

    description:
      "Find professionals who can diagnose and clear blocked, slow, or repeatedly clogged drains throughout your home or property.",

    services: [
      "Kitchen sink drain cleaning",
      "Bathroom drain cleaning",
      "Shower and bathtub drains",
      "Toilet drain clearing",
      "Main sewer drain cleaning",
      "Hydro jetting services",
      "Drain inspection",
      "Clogged drain repair",
    ],

    whenToCall: [
      "Water drains slower than normal",
      "A drain repeatedly becomes clogged",
      "Several fixtures back up together",
      "You notice unpleasant drain odors",
      "You hear gurgling from your drains",
      "Standing water appears around fixtures",
      "A plunger does not solve the problem",
    ],

    checklist: [
      "Avoid using harsh chemical drain cleaners",
      "Identify which fixtures are affected",
      "Note when the blockage started",
      "Tell the plumber about previous repairs",
      "Ask whether camera inspection is needed",
      "Ask whether hydro jetting is appropriate",
      "Describe any recurring drainage problems",
    ],
  },


  /* =======================================================
     WATER HEATER
  ======================================================= */

  "Water Heater": {
    title: "Water heater repair and replacement near you",

    description:
      "Compare local plumbers for water heater diagnosis, repair, maintenance, installation, and replacement for tank and tankless systems.",

    services: [
      "Water heater repair",
      "Tank water heater service",
      "Tankless water heater service",
      "Water heater replacement",
      "Water heater installation",
      "Water heater maintenance",
      "Energy-efficient upgrades",
      "Water heater troubleshooting",
    ],

    whenToCall: [
      "There is no hot water",
      "Hot water runs out unusually quickly",
      "The unit is leaking",
      "The heater makes unusual noises",
      "Water appears rusty or discolored",
      "The heater frequently stops working",
      "The temperature is inconsistent",
    ],

    checklist: [
      "Check the temperature setting",
      "Write down any error codes",
      "Keep the area around the heater clear",
      "Do not attempt unsafe repairs",
      "Tell the plumber the heater's age",
      "Identify the heater type if known",
      "Ask about repair versus replacement",
    ],
  },


  /* =======================================================
     LEAK DETECTION
  ======================================================= */

  "Leak Detection": {
    title: "Leak detection specialists near you",

    description:
      "Locate hidden plumbing leaks before they cause unnecessary water waste or property damage. Compare professionals who can inspect and locate difficult leaks.",

    services: [
      "Hidden water leak detection",
      "Wall leak detection",
      "Slab leak detection",
      "Pipe leak detection",
      "Fixture leak inspection",
      "Water pressure testing",
      "Water meter inspection",
      "Leak repair recommendations",
    ],

    whenToCall: [
      "Your water bill suddenly increases",
      "You hear running water when fixtures are off",
      "Walls or ceilings show damp spots",
      "Paint begins peeling unexpectedly",
      "You notice mold or persistent moisture",
      "Your water meter continues running",
      "You notice unexplained water damage",
    ],

    checklist: [
      "Record unusual water usage",
      "Check your water meter if possible",
      "Document visible stains or moisture",
      "Note where the problem appears",
      "Avoid opening walls yourself",
      "Ask how the leak will be located",
      "Ask what repair options are available",
    ],
  },


  /* =======================================================
     PIPE REPAIR
  ======================================================= */

  "Pipe Repair": {
    title: "Pipe repair and repiping near you",

    description:
      "Find local plumbing professionals for damaged, leaking, corroded, frozen, or aging pipes and water lines.",

    services: [
      "Leaking pipe repair",
      "Burst pipe repair",
      "Frozen pipe repair",
      "Corroded pipe replacement",
      "Water line repair",
      "Pipe repiping",
      "Plumbing pipe inspection",
      "Underground pipe repair",
    ],

    whenToCall: [
      "A pipe is visibly leaking",
      "A pipe has frozen or burst",
      "Water pressure suddenly drops",
      "You notice pipe corrosion",
      "Leaks keep returning",
      "Your plumbing system is aging",
      "Water appears discolored",
    ],

    checklist: [
      "Shut off the water when necessary",
      "Identify the affected area",
      "Note the pipe material if known",
      "Take photos of visible damage",
      "Ask about temporary and permanent repairs",
      "Request repair and replacement options",
      "Ask about expected repair time",
    ],
  },


  /* =======================================================
     TOILET REPAIR
  ======================================================= */

  "Toilet Repair": {
    title: "Bathroom plumbing and toilet repair near you",

    description:
      "Get professional help with toilets, faucets, showers, bathroom drains, and other bathroom plumbing problems.",

    services: [
      "Toilet repair",
      "Toilet replacement",
      "Toilet clog removal",
      "Faucet repair",
      "Shower plumbing",
      "Bathroom drain cleaning",
      "Water-saving fixture installation",
      "Bathroom fixture replacement",
    ],

    whenToCall: [
      "A toilet constantly runs",
      "The toilet will not flush",
      "The toilet frequently becomes clogged",
      "A faucet continuously leaks",
      "A shower has low water pressure",
      "Bathroom drains back up",
      "A fixture is damaged or leaking",
    ],

    checklist: [
      "Avoid repeatedly flushing a clogged toilet",
      "Turn off the fixture water supply if needed",
      "Identify the affected bathroom fixture",
      "Describe the problem clearly",
      "Tell the plumber about previous repairs",
      "Ask about water-efficient replacement options",
      "Ask about the expected repair cost",
    ],
  },


  /* =======================================================
     SEWER LINE
  ======================================================= */

  "Sewer Line": {
    title: "Sewer line service near you",

    description:
      "Compare professionals for sewer inspections, cleaning, repairs, and replacement when multiple drains are affected or wastewater is backing up.",

    services: [
      "Sewer line inspection",
      "Sewer drain cleaning",
      "Sewer blockage removal",
      "Sewer pipe repair",
      "Sewer line replacement",
      "Camera sewer inspection",
      "Root intrusion removal",
      "Underground sewer repair",
    ],

    whenToCall: [
      "Several drains back up together",
      "Sewage appears in a tub or shower",
      "Floor drains overflow",
      "You notice strong sewer odors",
      "Your yard develops unusually wet areas",
      "Drains repeatedly become blocked",
      "You hear unusual sounds from drains",
    ],

    checklist: [
      "Limit water usage until inspected",
      "Keep people away from contaminated water",
      "Keep children and pets away from affected areas",
      "Document visible sewage or water damage",
      "Ask about camera inspection",
      "Ask whether repair or replacement is recommended",
      "Ask about the expected project timeline",
    ],
  },


  /* =======================================================
     COMMERCIAL PLUMBING
  ======================================================= */

  "Commercial Plumbing": {
    title: "Commercial plumbing services near you",

    description:
      "Find commercial plumbing professionals for businesses, offices, retail properties, restaurants, and other commercial spaces.",

    services: [
      "Commercial plumbing repair",
      "Commercial drain cleaning",
      "Commercial fixture installation",
      "Commercial water heater service",
      "Plumbing maintenance",
      "Commercial pipe repair",
      "Plumbing system upgrades",
      "Commercial emergency plumbing",
    ],

    whenToCall: [
      "A plumbing issue affects business operations",
      "Customers or employees are affected",
      "A commercial fixture stops working",
      "You need scheduled maintenance",
      "You are renovating a commercial property",
      "New plumbing fixtures need installation",
      "A plumbing problem creates a safety concern",
    ],

    checklist: [
      "Provide the property type",
      "Share operating hours",
      "Explain site access requirements",
      "Identify affected plumbing areas",
      "Ask about response times",
      "Ask about maintenance plans",
      "Share any building restrictions",
    ],
  },


  /* =======================================================
     HYDRO JETTING
  ======================================================= */

  "Hydro Jetting": {
    title: "Hydro jetting services near you",

    description:
      "Compare local plumbers who use high-pressure water jetting to clear grease, scale, roots, and heavy buildup from drains and sewer lines.",

    services: [
      "Kitchen and main line hydro jetting",
      "Sewer line jetting",
      "Grease and scale removal",
      "Tree root clearing",
      "Camera inspection before and after jetting",
      "Commercial drain jetting",
      "Preventive drain maintenance",
    ],

    whenToCall: [
      "Clogs return shortly after snaking",
      "Several drains are slow at the same time",
      "Grease buildup affects kitchen drains",
      "A camera inspection shows roots or scale",
      "Your business needs routine drain maintenance",
      "Odors persist after regular cleaning",
    ],

    checklist: [
      "Share the age and material of your pipes",
      "List which drains are affected",
      "Mention any recent drain cleaning",
      "Ask whether a camera inspection is included",
      "Confirm access to cleanouts",
      "Ask about maintenance schedules",
    ],
  },


  /* =======================================================
     GARBAGE DISPOSAL
  ======================================================= */

  "Garbage Disposal": {
    title: "Garbage disposal repair and installation near you",

    description:
      "Find local plumbers to repair jammed, leaking, or noisy garbage disposals and to install or replace kitchen disposal units.",

    services: [
      "Garbage disposal repair",
      "Disposal replacement",
      "New disposal installation",
      "Jam and clog removal",
      "Leak repair under the sink",
      "Dishwasher drain connection",
      "Disposal upgrade recommendations",
    ],

    whenToCall: [
      "The disposal hums but will not spin",
      "Water leaks under the kitchen sink",
      "The unit trips its reset button often",
      "Strong odors persist after cleaning",
      "The kitchen sink drains slowly",
      "You want to add a disposal to your kitchen",
    ],

    checklist: [
      "Turn off power to the disposal",
      "Note the brand and model number",
      "Describe the sounds or symptoms",
      "Check for leaks under the sink",
      "Mention dishwasher connections",
      "Ask about warranty on new units",
    ],
  },


  /* =======================================================
     SUMP PUMP
  ======================================================= */

  "Sump Pump": {
    title: "Sump pump repair and installation near you",

    description:
      "Compare local plumbers for sump pump installation, repair, replacement, and battery backups that protect basements from flooding.",

    services: [
      "Sump pump installation",
      "Sump pump repair",
      "Pump replacement",
      "Battery backup systems",
      "Float switch repair",
      "High-water alarms",
      "Basement flood prevention",
    ],

    whenToCall: [
      "The pump runs constantly or never turns on",
      "Water is collecting in the basement",
      "The pump makes grinding or rattling noises",
      "Your pump is more than 7–10 years old",
      "Heavy storms are expected",
      "Your basement has flooded before",
    ],

    checklist: [
      "Check the pump has power",
      "Note the age of the current pump",
      "Share past flooding history",
      "Describe the size of your basement",
      "Ask about backup pump options",
      "Ask about maintenance and testing",
    ],
  },


  /* =======================================================
     WATER SOFTENER
  ======================================================= */

  "Water Softener": {
    title: "Water softener and filtration services near you",

    description:
      "Find local plumbers who install and service water softeners, whole-home filtration, and water treatment systems for hard or poor-quality water.",

    services: [
      "Water softener installation",
      "Whole-home water filtration",
      "Reverse osmosis systems",
      "Softener repair and servicing",
      "Water quality testing",
      "Salt and filter replacement",
      "Hard water treatment",
    ],

    whenToCall: [
      "Scale builds up on faucets and fixtures",
      "Appliances wear out faster than expected",
      "Dishes come out spotty",
      "Tap water tastes or smells unusual",
      "Your softener stops regenerating",
      "You are moving into a home with hard water",
    ],

    checklist: [
      "Test or share your water hardness",
      "Note your household size",
      "Share where the main water line enters",
      "Mention any existing treatment equipment",
      "Compare system sizes and running costs",
      "Ask about maintenance requirements",
    ],
  },
};
