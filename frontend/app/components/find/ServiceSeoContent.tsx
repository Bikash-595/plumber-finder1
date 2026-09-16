// import Link from "next/link";

// type ServiceContent = {
//   title: string;
//   description: string;
//   whenToCall: string[];
//   checklist: string[];
// };

// const SERVICE_CONTENT: Record<string, ServiceContent> = {
//   "Emergency Service": {
//     title: "Emergency plumbing services near you",
//     description: "A plumbing emergency can quickly damage floors, walls, and belongings. Compare local plumbers who can help with urgent leaks, burst pipes, overflowing fixtures, and loss of water service.",
//     whenToCall: ["A pipe has burst or is actively leaking", "A toilet or drain is overflowing", "You smell gas or sewage, or have no running water"],
//     checklist: ["Turn off the nearest water supply when it is safe", "Move valuables away from water and take photos of damage", "Tell the plumber what happened and when the problem began"],
//   },
//   "Drain Cleaning": {
//     title: "Drain cleaning plumbers near you",
//     description: "Slow, blocked, or repeatedly clogged drains often need more than a chemical cleaner. Find drain cleaning professionals for sinks, showers, tubs, toilets, and main sewer lines.",
//     whenToCall: ["Water drains slowly or backs up", "Several fixtures clog at the same time", "You notice recurring odors, gurgling, or standing water"],
//     checklist: ["Avoid pouring harsh chemicals into the drain", "Note which fixtures are affected", "Ask whether camera inspection or hydro jetting is appropriate"],
//   },
//   "Water Heater": {
//     title: "Water heater repair and replacement near you",
//     description: "Whether your water is cold, discolored, or inconsistent, a qualified plumber can diagnose your tank or tankless water heater and recommend a practical repair or replacement.",
//     whenToCall: ["There is no hot water or it runs out quickly", "The unit leaks, makes unusual noises, or produces rusty water", "Your water heater is nearing the end of its expected lifespan"],
//     checklist: ["Check the temperature setting and note any error codes", "Keep the area around the heater clear", "Ask about energy-efficient repair and replacement options"],
//   },
//   "Leak Detection": {
//     title: "Leak detection specialists near you",
//     description: "Hidden leaks can waste water and cause structural damage before they are visible. Compare plumbers who use targeted testing to locate leaks in pipes, fixtures, slabs, and walls.",
//     whenToCall: ["Your water bill rises without a clear reason", "You see damp spots, peeling paint, or mold", "You hear running water when fixtures are off"],
//     checklist: ["Record changes in your water meter if possible", "Document visible staining or moisture", "Ask how the plumber will locate and repair the leak"],
//   },
//   "Pipe Repair": {
//     title: "Pipe repair and repiping near you",
//     description: "Damaged, corroded, or frozen pipes require prompt professional attention. Find local plumbers for isolated pipe repairs, leak repairs, and larger repiping projects.",
//     whenToCall: ["A pipe leaks, freezes, or has visible corrosion", "Water pressure has dropped in one or more areas", "You have frequent repairs on aging plumbing"],
//     checklist: ["Shut off water if a leak is active", "Note the pipe material and affected area if known", "Request repair and replacement options before work begins"],
//   },
//   "Toilet Repair": {
//     title: "Bathroom plumbing and toilet repair near you",
//     description: "Bathroom plumbing problems can interrupt daily life and waste water. Compare local plumbers for toilet repairs, fixture installation, shower issues, faucet leaks, and bathroom drain problems.",
//     whenToCall: ["A toilet runs, leaks, clogs, or will not flush", "A shower or faucet has low pressure or persistent leaks", "Bathroom drains back up or smell unpleasant"],
//     checklist: ["Avoid repeatedly flushing a clogged toilet", "Identify the affected fixture and symptoms", "Ask about water-saving fixture options when replacing parts"],
//   },
//   "Sewer Line": {
//     title: "Sewer line service near you",
//     description: "A sewer line issue can affect multiple drains and may require inspection, cleaning, repair, or replacement. Find qualified plumbers to assess the cause and explain the available options.",
//     whenToCall: ["Multiple drains back up together", "Sewage appears in a tub, shower, or floor drain", "You notice sewer odors or wet patches in the yard"],
//     checklist: ["Avoid using water fixtures until the issue is assessed", "Keep children and pets away from contaminated water", "Ask whether a camera inspection is included in the diagnosis"],
//   },
//   "Commercial Plumbing": {
//     title: "Commercial plumbing services near you",
//     description: "Businesses need reliable plumbing support that minimizes disruption. Compare commercial plumbers for repairs, maintenance, fixtures, drain service, and plumbing upgrades for your property.",
//     whenToCall: ["A plumbing issue affects staff, customers, or operations", "You need scheduled maintenance for a commercial property", "You are renovating or adding fixtures to a business space"],
//     checklist: ["Share the property type, operating hours, and access requirements", "Document the affected fixtures or areas", "Ask about maintenance plans and response times"],
//   },
// };

// export default function ServiceSeoContent({ service }: { service: string }) {
//   const content = SERVICE_CONTENT[service];
//   if (!content) return null;

//   return (
//     <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-800 sm:p-8" aria-labelledby="service-help-heading">
//       <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#756100]">Service guide</p>
//       <h2 id="service-help-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-[#0f2a4d] sm:text-3xl">{content.title}</h2>
//       <p className="mt-3 max-w-4xl leading-7 text-slate-600">{content.description}</p>
//       <div className="mt-6 grid gap-6 md:grid-cols-2">
//         <div className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="font-bold text-[#0f2a4d]">When to call a plumber</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{content.whenToCall.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD60A]" />{item}</li>)}</ul></div>
//         <div className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="font-bold text-[#0f2a4d]">Before your appointment</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{content.checklist.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD60A]" />{item}</li>)}</ul></div>
//       </div>
//       <p className="mt-6 text-sm text-slate-600">Compare profiles, reviews, availability, and services to choose a plumber with confidence. <Link href="/post-requirement" className="font-bold text-[#0f2a4d] underline decoration-[#FFD60A] decoration-2 underline-offset-4">Request free quotes</Link>.</p>
//     </section>
//   );
// }











import Link from "next/link";

/* =========================================================
   TYPES
========================================================= */

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

const SERVICE_CONTENT: Record<string, ServiceContent> = {
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
};


/* =========================================================
   REUSABLE COLUMN COMPONENT
========================================================= */

function ContentColumn({
  number,
  title,
  items,
  border = true,
}: {
  number: string;
  title: string;
  items: string[];
  border?: boolean;
}) {
  return (
    <div
      className={`
        p-6
        sm:p-7
        lg:p-8
        ${
          border
            ? "border-b border-slate-200 md:border-b-0 md:border-r"
            : ""
        }
      `}
    >

      {/* COLUMN HEADER */}

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#fff7bf]
            text-xs
            font-extrabold
            text-[#0f2a4d]
          "
        >
          {number}
        </div>

        <h3
          className="
            text-lg
            font-bold
            tracking-tight
            text-[#0f2a4d]
          "
        >
          {title}
        </h3>

      </div>


      {/* CONTENT LIST */}

      <div className="mt-6 space-y-4">

        {items.map((item) => (
          <div
            key={item}
            className="
              group
              text-[15px]
              leading-6
              text-slate-600
              transition-colors
              duration-200
            "
          >
            <span
              className="
                inline
                cursor-default
                transition-colors
                group-hover:text-[#0f2a4d]
              "
            >
              {item}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ServiceSeoContent({
  service,
}: {
  service: string;
}) {
  const content = SERVICE_CONTENT[service];

  /*
   * If service does not exist in SERVICE_CONTENT,
   * do not render anything.
   */
  if (!content) {
    return null;
  }


  return (
    <section
      className="
        mt-12
        border-y
        border-slate-200
        bg-white
      "
      aria-labelledby="service-help-heading"
    >

      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-12
          sm:px-6
          sm:py-14
          lg:px-8
          lg:py-16
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="max-w-4xl">

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-[#756100]
            "
          >
            Service guide
          </p>


          <h2
            id="service-help-heading"
            className="
              mt-3
              text-3xl
              font-extrabold
              tracking-tight
              text-[#0f2a4d]
              sm:text-4xl
            "
          >
            {content.title}
          </h2>


          <p
            className="
              mt-4
              max-w-3xl
              text-base
              leading-7
              text-slate-600
            "
          >
            {content.description}
          </p>

        </header>


        {/* =================================================
            THREE COLUMN CONTENT
        ================================================= */}

        <div
          className="
            mt-10
            grid
            grid-cols-1
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            md:grid-cols-3
          "
        >

          {/* COLUMN 01 */}

          <ContentColumn
            number="01"
            title="Services available"
            items={content.services}
          />


          {/* COLUMN 02 */}

          <ContentColumn
            number="02"
            title="When to call"
            items={content.whenToCall}
          />


          {/* COLUMN 03 */}

          <ContentColumn
            number="03"
            title="Before your appointment"
            items={content.checklist}
            border={false}
          />

        </div>


        {/* =================================================
            CTA
        ================================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-5
            rounded-2xl
            bg-[#f8fafc]
            p-5
            sm:p-6
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-base
                font-bold
                text-[#0f2a4d]
              "
            >
              Need help with {service.toLowerCase()}?
            </p>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-slate-500
              "
            >
              Compare local professionals, reviews, availability,
              and services before making your choice.
            </p>

          </div>


          <Link
            href="/post-requirement"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FFD60A]
              px-6
              py-3
              text-sm
              font-bold
              text-[#0f2a4d]
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-yellow-300
              hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-[#FFD60A]
              focus:ring-offset-2
            "
          >
            Request free quotes

            <span
              aria-hidden="true"
              className="ml-2 text-base"
            >
              →
            </span>

          </Link>

        </div>


        {/* =================================================
            SMALL SUPPORTING TEXT
        ================================================= */}

        <p
          className="
            mt-5
            max-w-4xl
            text-xs
            leading-5
            text-slate-400
          "
        >
          Service availability, pricing, response times, and repair
          requirements may vary by location and provider. Compare
          local professionals to find the service that best matches
          your needs.
        </p>

      </div>

    </section>
  );
}