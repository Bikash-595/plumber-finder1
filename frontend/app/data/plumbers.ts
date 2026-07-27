import { Plumber } from "@/components/find/types";



function buildDefaultBlogs(plumber: Plumber): NonNullable<Plumber["blogs"]> {
  const services = plumber.services ?? [];
  const specializations = plumber.specializations ?? [];
  const primaryService = services[0] ?? "plumbing";
  const primarySpecialization = specializations[0] ?? "home plumbing";
  const slugBase = (plumber.companyName ?? "plumber").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fallbackImage = plumber.media?.images?.[0] ?? "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800";

  return [
    {
      slug: `${slugBase}-service-guide`,
      title: `${plumber.companyName}: What to Know Before Booking`,
      summary: `A quick guide to ${plumber.companyName ?? "this company"}'s ${primaryService.toLowerCase()} services and what customers can expect.`,
      content: `<p>${plumber.companyName ?? "This company"} is built around ${primarySpecialization.toLowerCase()} work, local service, and reliable scheduling.</p><p>This guide helps customers understand the most common jobs, what the team offers, and when to request a quote.</p>`,
      image: fallbackImage,
      author: plumber.ownerName ?? "Team",
      date: "2024-04-01",
      readTime: 4,
      readCount: Math.max(120, Math.round(plumber.reviewCount * 1.5)),
      reactions: { like: 12, love: 8, helpful: 19 },
      comments: []
    },
    {
      slug: `${slugBase}-faqs`,
      title: `Common Questions About ${plumber.companyName}`,
      summary: `Answers to the most common questions customers ask about ${plumber.companyName ?? "this company"}.`,
      content: `<p>Here are the practical questions customers usually ask before booking ${plumber.companyName ?? "this company"}. If you are comparing local plumbers, these answers can help you choose the right team for your home and budget.</p><h2>What services are available?</h2><p>${plumber.companyName ?? "This company"} usually handles both routine and urgent plumbing work. Common jobs include leak repair, drain cleaning, faucet and fixture replacement, toilet repair, water heater diagnostics, pipe inspections, and preventive maintenance.</p><p>Before booking, ask for a clear scope of work so you understand exactly what is included in the visit and what may require a follow-up appointment.</p><h2>Is emergency service offered?</h2><p>${plumber.isEmergency ? `${plumber.companyName ?? "This company"} offers emergency service and can support urgent issues such as burst pipes, major leaks, sewer backups, or no hot water situations.` : `${plumber.companyName ?? "This company"} may provide rapid response during business hours. For after-hours urgent jobs, call first to confirm current emergency availability.`}</p><p>When calling about an emergency, be ready to share photos, the location of the issue, and whether the main shutoff valve has been turned off. This helps the team prioritize and prepare before arrival.</p><h2>What areas are covered?</h2><p>${plumber.companyName ?? "This company"} serves ${plumber.location ?? "the local area"}${plumber.serviceAreas?.length ? ` and nearby areas such as ${plumber.serviceAreas.slice(0, 5).join(", ")}` : " and nearby neighborhoods"}. Service area coverage can vary by job type and schedule, so always confirm your exact address when requesting a quote.</p><h2>How should I prepare before booking?</h2><p>To get faster and more accurate service, have these details ready:</p><ul><li>A short description of the issue and when it started</li><li>Any visible leak points, noises, or recurring symptoms</li><li>Photos or videos of the problem area when possible</li><li>Your preferred appointment window and access instructions</li></ul><p>Good preparation helps reduce diagnostic time and often leads to a clearer first-visit estimate.</p><h2>Final takeaway</h2><p>Choosing a plumber is easier when you ask practical questions about service scope, response time, and service area coverage. ${plumber.companyName ?? "This company"} aims to provide transparent communication so customers can book with confidence.</p>`,
      image: fallbackImage,
      author: plumber.ownerName ?? "Team",
      date: "2024-04-08",
      readTime: 6,
      readCount: Math.max(100, Math.round(plumber.reviewCount * 1.2)),
      reactions: { like: 9, love: 5, helpful: 14 },
      comments: []
    },
    {
      slug: `${slugBase}-tips`,
      title: `5 Plumbing Tips from ${plumber.companyName.split(" ")[0]}`,
      summary: `Expert advice to keep your pipes and fixtures in top shape.`,
      content: `<p>Learn from the pros at ${plumber.companyName}. Here are five tips to avoid common plumbing problems.</p><ul><li>Never ignore a small leak</li><li>Know where your main shutoff valve is</li><li>Don't use chemical drain cleaners</li><li>Insulate exposed pipes</li><li>Schedule annual inspections</li></ul>`,
      image: fallbackImage,
      author: plumber.ownerName ?? "Team",
      date: "2024-03-15",
      readTime: 5,
      readCount: Math.max(150, Math.round(plumber.reviewCount * 1.3)),
      reactions: { like: 20, love: 12, helpful: 28 },
      comments: []
    },
    {
      slug: `${slugBase}-emergency`,
      title: `Emergency Plumbing: How ${plumber.companyName.split(" ")[0]} Responds`,
      summary: `What to do in a plumbing emergency and how our team helps.`,
      content: `<p>${plumber.companyName} offers ${plumber.isEmergency ? "24/7 emergency service" : "rapid response during business hours"}. Here's our process when you call us.</p><h2>Step 1: Assess the situation</h2><p>We'll ask questions to understand the severity.</p><h2>Step 2: Dispatch a technician</h2><p>We send a licensed plumber to your location as fast as possible.</p><h2>Step 3: Fix the issue</h2><p>Our goal is to resolve the problem on the first visit.</p>`,
      image: fallbackImage,
      author: plumber.ownerName ?? "Team",
      date: "2024-02-20",
      readTime: 6,
      readCount: Math.max(200, Math.round(plumber.reviewCount * 1.6)),
      reactions: { like: 32, love: 18, helpful: 45 },
      comments: []
    }
  ];
}

function buildDefaultFaqs(plumber: Plumber): NonNullable<Plumber["faqs"]> {
  const services = plumber.services ?? [];
  const specializations = plumber.specializations ?? [];
  const serviceAreas = plumber.serviceAreas ?? [];
  const location = plumber.location ?? "your area";
  return [
    {
      question: `What does ${plumber.companyName ?? "this company"} specialize in?`,
      answer: `${plumber.companyName ?? "This company"} specializes in ${specializations.slice(0, 3).join(", ") || "general plumbing"} and supports ${services.slice(0, 4).join(", ") || "core plumbing services"}.`
    },
    {
      question: `Does ${plumber.companyName ?? "this company"} handle emergency work?`,
      answer: plumber.isEmergency
        ? `${plumber.companyName ?? "This company"} offers emergency service and can help with urgent plumbing issues.`
        : `${plumber.companyName ?? "This company"} does not advertise 24/7 emergency service, but you can call to confirm same-day availability.`
    },
    {
      question: `Where does ${plumber.companyName ?? "this company"} work?`,
      answer: `${plumber.companyName ?? "This company"} serves ${location} and nearby areas such as ${serviceAreas.slice(0, 3).join(", ") || "nearby neighborhoods"}.`
    },
    {
      question: `Is ${plumber.companyName ?? "this company"} licensed and insured?`,
      answer: `${plumber.companyName ?? "This company"} is listed as ${plumber.licenseNumber ? `license ${plumber.licenseNumber}` : "licensed"} and carries ${plumber.insurance ?? "insurance coverage"}.`
    }
  ];
}

function buildDefaultTeam(plumber: Plumber): NonNullable<Plumber["teamMembers"]> {
  const serviceOne = plumber.services[0] ?? "General plumbing";
  const serviceTwo = plumber.services[1] ?? "Leak repair";
  const primarySpecialty = plumber.specializations[0] ?? "Residential plumbing";
  const years = Math.max(3, plumber.yearsInBusiness);

  return [
    {
      id: `${plumber.id}-owner`,
      name: plumber.ownerName,
      role: "Owner & Lead Plumber",
      photo: plumber.logo,
      specialties: [primarySpecialty, serviceOne],
      experience: years,
      certificates: plumber.certifications.slice(0, 2),
      licenseNumber: plumber.licenseNumber,
      availability: plumber.availability,
      bio: `${plumber.ownerName} leads the ${plumber.companyName} team with a focus on clear communication and dependable work.`,
    },
    {
      id: `${plumber.id}-senior-tech`,
      name: "Alex Morgan",
      role: "Senior Plumbing Technician",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      specialties: [serviceOne, serviceTwo],
      experience: Math.max(5, years - 3),
      certificates: ["Licensed technician", "Safety trained"],
      availability: "Available for appointments",
      bio: `Alex handles diagnostics and repairs across ${plumber.location}, with particular experience in ${serviceOne.toLowerCase()}.`,
    },
    {
      id: `${plumber.id}-service-tech`,
      name: "Taylor Brooks",
      role: "Service Technician",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      specialties: [serviceTwo, "Preventive maintenance"],
      experience: Math.max(3, years - 6),
      certificates: ["Customer care trained", "OSHA safety"],
      availability: "Available this week",
      bio: "Taylor helps homeowners understand their options and delivers careful, tidy service visits.",
    },
    {
      id: `${plumber.id}-coordinator`,
      name: "Jordan Lee",
      role: "Service Coordinator",
      photo: "https://randomuser.me/api/portraits/men/46.jpg",
      specialties: ["Scheduling", "Customer support"],
      experience: Math.max(2, Math.floor(years / 2)),
      certificates: ["Customer service trained"],
      availability: "Office hours",
      bio: "Jordan coordinates appointments and makes sure customers have clear arrival and service information.",
    },
  ];
}

function slugifyProjectId(value: string, fallback: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || fallback;
}

function getClientType(client: string) {
  const normalized = client.toLowerCase();

  if (normalized.includes("hotel")) return "Hospitality";
  if (normalized.includes("school") || normalized.includes("district")) return "Education";
  if (normalized.includes("restaurant") || normalized.includes("grill") || normalized.includes("cafe")) return "Food service";
  if (normalized.includes("apartment") || normalized.includes("condo") || normalized.includes("residence")) return "Multi-family residential";
  if (normalized.includes("home") || normalized.includes("rowhouse")) return "Residential homeowner";
  if (normalized.includes("city") || normalized.includes("hospital")) return "Public facility";

  return "Commercial client";
}

function inferProjectCategory(project: Plumber["projects"][number], plumber: Plumber) {
  const text = `${project.title} ${project.description}`.toLowerCase();

  if (text.includes("water heater") || text.includes("tankless")) return "Water heater installation";
  if (text.includes("sewer")) return "Sewer line service";
  if (text.includes("drain") || text.includes("clog")) return "Drain and cleaning service";
  if (text.includes("leak") || text.includes("pipe") || text.includes("repipe")) return "Pipe and leak repair";
  if (text.includes("sump")) return "Pump system installation";
  if (text.includes("backflow")) return "Backflow prevention";

  return plumber.specializations[0] ?? plumber.services[0] ?? "Plumbing project";
}

function enrichProjects(plumber: Plumber): Plumber["projects"] {
  return (plumber.projects ?? []).map((project, index) => {
    const category = inferProjectCategory(project, plumber);
    const completedAt = `${project.year}-${String(Math.min(index + 2, 12)).padStart(2, "0")}-15`;
    const projectCost = project.projectCost ?? Math.max(plumber.averageCost * (index + 6), 2400);
    const durationDays = project.durationDays ?? Math.max(index + 2, Math.round(projectCost / 9000));
    const clientRating = project.clientRating ?? Math.min(5, Number((plumber.rating + (index % 2 === 0 ? 0.1 : -0.1)).toFixed(1)));

    return {
      ...project,
      id: project.id ?? slugifyProjectId(project.title, `project-${index + 1}`),
      clientRating,
      durationDays,
      projectCost,
      clientReview:
        project.clientReview ??
        `${plumber.companyName} kept the work organized, communicated clearly, and delivered the project as promised.`,
      clientDetails: project.clientDetails ?? {
        name: project.client,
        type: getClientType(project.client),
        location: plumber.location,
        contactPerson: plumber.ownerName,
      },
      projectDetails: project.projectDetails ?? {
        category,
        scope: project.description,
        challenge: `The client needed dependable ${category.toLowerCase()} work with limited disruption and a clear completion schedule.`,
        solution: `${plumber.companyName} assigned a licensed crew, completed diagnostics, installed the required materials, tested the system, and walked the client through maintenance and warranty coverage.`,
        materials: plumber.services.slice(0, 4),
        teamSize: Math.max(2, Math.min(plumber.teamSize, 8)),
        warranty: plumber.warranty,
        completedAt,
      },
    };
  });
}

const rawPlumbers = [
  {
    id: "1",
    companyName: "Premier New York Plumbing",
    ownerName: "Sarah Johnson",
    rating: 4.5,
    reviewCount: 342,
    logo: "https://randomuser.me/api/portraits/women/68.jpg",
    services: ["Leak Repair", "Water Heater", "Pipe Repair", "Sewer Line", "Emergency Service", "Toilet Repair"],
    priceRange: "$99 diag",
    averageCost: 487,
    availability: "Weekends only",
    isVerified: true,
    isEmergency: false,
    location: "New York, NY",
    city: "New York",
    state: "NY",
    phone: "(212) 555-1234",
    email: "contact@premiernewyorkplumbing.com",
    website: "https://premiernewyorkplumbing.com",
    description: "Premier New York Plumbing has been serving New York, NY for over 21 years. We specialize in Emergency and Water Heaters. Fully licensed and insured.",
    yearsInBusiness: 21,
    established: 2005,
    licenseNumber: "PL-54892",
    insurance: "$4M liability",
    certifications: ["EPA", "OSHA"],
    serviceAreas: ["Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX"],
    specializations: ["Emergency", "Water Heaters", "Sewer", "Commercial"],
    responseTime: "< 4 hours",
    teamSize: 42,
    socialLinks: {
      facebook: "https://facebook.com/PremierNewYorkPlumbing",
      twitter: "https://twitter.com/PremierNewYorkPlumbing",
      instagram: "https://instagram.com/PremierNewYorkPlumbing"
    },
    warranty: "1 year",
    paymentMethods: ["Cash", "Check", "Credit Card"],
    languages: ["English", "Spanish"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
        "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"
      ],
      videos: [
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "https://www.youtube.com/embed/9bZkp7q19f0",
        "https://www.youtube.com/embed/tgbNymZ7vqY",
        "https://www.youtube.com/embed/L_jWHffIx5E"
      ]
    },
    distance: 2.3,
    discount: "15% off first service",
    promoCode: "NYPLUMB15",
    branches: [
      { name: "Manhattan Office", lat: 40.7128, lng: -74.0060, address: "123 Broadway, New York, NY 10001" },
      { name: "Brooklyn Branch", lat: 40.6782, lng: -73.9442, address: "456 Fulton St, Brooklyn, NY 11201" }
    ],
    projects: [
      {
        title: "Luxury High‑rise Repiping",
        client: "The Plaza",
        description: "Complete replacement of aging pipes in a 40‑story building. Used eco‑friendly materials and minimized disruption.",
        image: "/Plumber working under a modern sink.png",
        year: 2023,
        clientRating: 4.8,
        clientReview: "Excellent work! Very professional and finished ahead of schedule.",
        durationDays: 45,
        projectCost: 125000
      },
      {
        title: "Emergency Flood Response",
        client: "Grand Central Hotel",
        description: "24/7 restoration after major pipe burst. Responded within 30 minutes, saved thousands in water damage.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        year: 2024,
        clientRating: 5.0,
        clientReview: "They saved our hotel from major disaster. Highly recommend!",
        durationDays: 3,
        projectCost: 28000
      },
      {
        title: "Water Heater Upgrade",
        client: "Local School District",
        description: "Replaced 12 old water heaters with energy‑efficient models, reducing energy bills by 30%.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
        year: 2022,
        clientRating: 4.5,
        clientReview: "Great work, very efficient and clean.",
        durationDays: 10,
        projectCost: 42000
      },
      {
        title: "Commercial Backflow Prevention",
        client: "City Hospital",
        description: "Installed and certified backflow preventers across the facility.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
        year: 2023,
        clientRating: 4.9,
        clientReview: "Thorough and compliant with all regulations.",
        durationDays: 14,
        projectCost: 18000
      }
    ],
    keyHighlights: ["Same‑day service", "Licensed & insured", "Free estimates", "Eco‑friendly options", "A+ BBB rating"],
    blogs: [] // will be filled by buildDefaultBlogs
  },
  {
    id: "2",
    companyName: "Elite Los Angeles Plumbing",
    ownerName: "Michael Chen",
    rating: 4.8,
    reviewCount: 287,
    logo: "https://randomuser.me/api/portraits/men/52.jpg",
    services: ["Drain Cleaning", "Pipe Repair", "Sewer Line", "Emergency Service", "Faucet Installation", "Garbage Disposal", "Hydro Jetting"],
    priceRange: "$120/hr",
    averageCost: 623,
    availability: "24/7 Emergency",
    isVerified: true,
    isEmergency: true,
    location: "Los Angeles, CA",
    city: "Los Angeles",
    state: "CA",
    phone: "(310) 555-6789",
    email: "contact@elitelosangelesplumbing.com",
    website: "https://elitelosangelesplumbing.com",
    description: "Elite Los Angeles Plumbing has been serving Los Angeles, CA for over 17 years. We specialize in Drain Cleaning and Sewer. Fully licensed and insured. Available 24/7 for emergencies.",
    yearsInBusiness: 17,
    established: 2009,
    licenseNumber: "PL-12387",
    insurance: "$2M liability",
    certifications: ["LEED", "GreenPlumber"],
    serviceAreas: ["New York, NY", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA"],
    specializations: ["Drain Cleaning", "Sewer", "Residential", "Remodeling"],
    responseTime: "< 30 min",
    teamSize: 28,
    socialLinks: {
      facebook: "https://facebook.com/EliteLosAngelesPlumbing",
      twitter: "https://twitter.com/EliteLosAngelesPlumbing",
      instagram: "https://instagram.com/EliteLosAngelesPlumbing"
    },
    warranty: "2 years",
    paymentMethods: ["Cash", "Credit Card", "Financing"],
    languages: ["English", "Spanish", "Mandarin"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
        "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
        "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"
      ],
      videos: [
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "https://www.youtube.com/embed/9bZkp7q19f0",
        "https://www.youtube.com/embed/tgbNymZ7vqY",
        "https://www.youtube.com/embed/L_jWHffIx5E"
      ]
    },
    distance: 5.7,
    discount: "20% off emergency calls",
    promoCode: "LAEMERG20",
    branches: [
      { name: "Downtown LA", lat: 34.0522, lng: -118.2437, address: "777 Figueroa St, Los Angeles, CA 90017" }
    ],
    projects: [
      {
        title: "Sewer Line Replacement",
        client: "Santa Monica Pier",
        description: "Replaced 500ft of corroded sewer pipe under the pier. Used trenchless technology to avoid disrupting businesses.",
        image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
        year: 2022,
        clientRating: 4.9,
        clientReview: "Amazing work! No downtime for our vendors.",
        durationDays: 14,
        projectCost: 95000
      },
      {
        title: "Drain Cleaning for Mall",
        client: "Westfield Century City",
        description: "Hydro‑jetted 2 miles of drainage lines, removing years of grease and debris.",
        image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
        year: 2023,
        clientRating: 4.7,
        clientReview: "Very thorough and professional.",
        durationDays: 5,
        projectCost: 18000
      },
      {
        title: "Emergency Burst Pipe",
        client: "Private Residence",
        description: "Responded within 20 minutes, fixed burst pipe and water damage. Saved the home from flooding.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        year: 2024,
        clientRating: 5.0,
        clientReview: "Lifesavers! Arrived quickly and fixed everything.",
        durationDays: 1,
        projectCost: 4500
      },
      {
        title: "Tankless Water Heater Installation",
        client: "Eco-Friendly Condo",
        description: "Installed high-efficiency tankless units for 20 units.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
        year: 2023,
        clientRating: 4.8,
        clientReview: "Great energy savings, perfect installation.",
        durationDays: 7,
        projectCost: 34000
      }
    ],
    keyHighlights: ["24/7 emergency response", "Free camera inspection", "Family‑owned", "A+ BBB rating", "Licensed & bonded"],
    blogs: []
  },
  {
    id: "3",
    companyName: "Express Chicago Plumbing",
    ownerName: "James Rodriguez",
    rating: 4.7,
    reviewCount: 212,
    logo: "https://randomuser.me/api/portraits/men/45.jpg",
    services: ["Faucet Installation", "Toilet Repair", "Garbage Disposal", "Water Heater", "Leak Repair"],
    priceRange: "$99 flat rate",
    averageCost: 350,
    availability: "Same-day",
    isVerified: true,
    isEmergency: false,
    location: "Chicago, IL",
    city: "Chicago",
    state: "IL",
    phone: "(312) 555-4321",
    email: "contact@expresschicagoplumbing.com",
    website: "https://expresschicagoplumbing.com",
    description: "Express Chicago Plumbing provides fast residential plumbing repairs and installations across Chicago neighborhoods.",
    yearsInBusiness: 9,
    established: 2017,
    licenseNumber: "PL-54321",
    insurance: "$1M liability",
    certifications: ["EPA"],
    serviceAreas: ["Chicago, IL", "Evanston, IL", "Oak Park, IL"],
    specializations: ["Residential", "Repairs", "Installations"],
    responseTime: "< 1 hour",
    teamSize: 12,
    socialLinks: {
      facebook: "https://facebook.com/ExpressChicagoPlumbing",
      instagram: "https://instagram.com/ExpressChicagoPlumbing"
    },
    warranty: "90 days",
    paymentMethods: ["Cash", "Check", "Credit Card"],
    languages: ["English", "Spanish"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800",
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800"
      ],
      videos: []
    },
    distance: 3.4,
    discount: "10% off first booking",
    promoCode: "CHI10",
    branches: [
      { name: "North Side Office", lat: 41.9028, lng: -87.6232, address: "1200 N Clark St, Chicago, IL 60610" }
    ],
    projects: [
      {
        title: "Condo Plumbing Upgrade",
        client: "Lakeview Residences",
        description: "Upgraded aging bathroom and kitchen plumbing lines in a 24-unit building.",
        image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
        year: 2024,
        clientRating: 4.7,
        clientReview: "Quick coordination and clean work.",
        durationDays: 8,
        projectCost: 24000
      }
    ],
    keyHighlights: ["Same-day visits", "Friendly team", "Upfront pricing"],
    blogs: []
  },
  {
    id: "4",
    companyName: "Houston Drain Masters",
    ownerName: "David Kim",
    rating: 4.6,
    reviewCount: 155,
    logo: "https://randomuser.me/api/portraits/men/22.jpg",
    services: ["Drain Snaking", "Hydro Jetting", "Clog Removal", "Sewer Line", "Video Inspection"],
    priceRange: "$85 service call",
    averageCost: 250,
    availability: "Business hours",
    isVerified: true,
    isEmergency: false,
    location: "Houston, TX",
    city: "Houston",
    state: "TX",
    phone: "(713) 555-2468",
    email: "contact@houstondrainmasters.com",
    website: "https://houstondrainmasters.com",
    description: "Houston Drain Masters specializes in tough clogs, sewer diagnostics, and preventive drain maintenance.",
    yearsInBusiness: 11,
    established: 2015,
    licenseNumber: "PL-13579",
    insurance: "$2M liability",
    certifications: ["EPA", "OSHA"],
    serviceAreas: ["Houston, TX", "Sugar Land, TX", "Pearland, TX"],
    specializations: ["Drain Cleaning", "Hydro Jetting", "Sewer"],
    responseTime: "< 2 hours",
    teamSize: 10,
    socialLinks: {
      facebook: "https://facebook.com/HoustonDrainMasters"
    },
    warranty: "90 days",
    paymentMethods: ["Cash", "Credit Card"],
    languages: ["English", "Spanish"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
      ],
      videos: []
    },
    distance: 6.2,
    discount: "Free camera inspection",
    promoCode: "DRAINFREE",
    branches: [
      { name: "West Houston", lat: 29.7604, lng: -95.3698, address: "200 Main St, Houston, TX 77002" }
    ],
    projects: [
      {
        title: "Restaurant Drain Rehab",
        client: "Bayou Grill",
        description: "Cleared recurring grease blockages and introduced a monthly maintenance plan.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
        year: 2023,
        clientRating: 4.8,
        clientReview: "No more backups during peak hours.",
        durationDays: 2,
        projectCost: 7200
      }
    ],
    keyHighlights: ["Drain experts", "Fast diagnostics", "Preventive plans"],
    blogs: []
  },
  {
    id: "5",
    companyName: "Phoenix Pipe Pros",
    ownerName: "Alicia Gomez",
    rating: 4.8,
    reviewCount: 198,
    logo: "https://randomuser.me/api/portraits/women/44.jpg",
    services: ["Pipe Repair", "Leak Detection", "Water Heater", "Repiping", "Water Softener"],
    priceRange: "$110/hr",
    averageCost: 410,
    availability: "Weekends only",
    isVerified: true,
    isEmergency: true,
    location: "Phoenix, AZ",
    city: "Phoenix",
    state: "AZ",
    phone: "(602) 555-8844",
    email: "hello@phoenixpipepros.com",
    website: "https://phoenixpipepros.com",
    description: "Phoenix Pipe Pros handles leak detection, repiping, and water quality solutions for homes and small businesses.",
    yearsInBusiness: 13,
    established: 2013,
    licenseNumber: "PL-88211",
    insurance: "$3M liability",
    certifications: ["EPA", "LEED"],
    serviceAreas: ["Phoenix, AZ", "Tempe, AZ", "Scottsdale, AZ"],
    specializations: ["Leak Detection", "Repiping", "Water Systems"],
    responseTime: "< 1 hour",
    teamSize: 16,
    socialLinks: {
      facebook: "https://facebook.com/PhoenixPipePros",
      instagram: "https://instagram.com/PhoenixPipePros"
    },
    warranty: "2 years",
    paymentMethods: ["Cash", "Credit Card", "Financing"],
    languages: ["English", "Spanish"],
    media: {
      images: [
        "/Plumber working under a modern sink.png",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"
      ],
      videos: []
    },
    distance: 7.1,
    discount: "15% off leak detection",
    promoCode: "LEAK15",
    branches: [
      { name: "Tempe Branch", lat: 33.4255, lng: -111.94, address: "15 Mill Ave, Tempe, AZ 85281" }
    ],
    projects: [
      {
        title: "Whole Home Repipe",
        client: "Desert Ridge Home",
        description: "Replaced old galvanized lines with modern PEX throughout a single-family home.",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
        year: 2024,
        clientRating: 4.9,
        clientReview: "Water pressure improved dramatically.",
        durationDays: 5,
        projectCost: 12800
      }
    ],
    keyHighlights: ["Emergency-ready", "Precision leak detection", "2-year warranty"],
    blogs: []
  },
  {
    id: "6",
    companyName: "Philly Flow Plumbing",
    ownerName: "Marcus Lee",
    rating: 4.4,
    reviewCount: 133,
    logo: "https://randomuser.me/api/portraits/men/31.jpg",
    services: ["Toilet Repair", "Faucet Installation", "Pipe Repair", "Sump Pump", "Drain Cleaning"],
    priceRange: "$95 diag",
    averageCost: 330,
    availability: "Business hours",
    isVerified: true,
    isEmergency: false,
    location: "Philadelphia, PA",
    city: "Philadelphia",
    state: "PA",
    phone: "(267) 555-9811",
    email: "support@phillyflowplumbing.com",
    website: "https://phillyflowplumbing.com",
    description: "Philly Flow Plumbing provides dependable everyday plumbing repairs and maintenance for homeowners.",
    yearsInBusiness: 8,
    established: 2018,
    licenseNumber: "PL-66209",
    insurance: "$1M liability",
    certifications: ["OSHA"],
    serviceAreas: ["Philadelphia, PA", "Camden, NJ", "King of Prussia, PA"],
    specializations: ["Residential Service", "Drain Cleaning", "Pump Systems"],
    responseTime: "< 4 hours",
    teamSize: 9,
    socialLinks: {
      facebook: "https://facebook.com/PhillyFlowPlumbing"
    },
    warranty: "1 year",
    paymentMethods: ["Cash", "Credit Card"],
    languages: ["English"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800"
      ],
      videos: []
    },
    distance: 4.8,
    discount: "$25 off first visit",
    promoCode: "PHILLY25",
    branches: [
      { name: "Center City", lat: 39.9526, lng: -75.1652, address: "88 Market St, Philadelphia, PA 19106" }
    ],
    projects: [
      {
        title: "Basement Sump Pump Install",
        client: "South Philly Rowhouse",
        description: "Installed dual sump pump setup with battery backup to prevent basement flooding.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        year: 2023,
        clientRating: 4.6,
        clientReview: "Excellent installation and explanation.",
        durationDays: 1,
        projectCost: 2800
      }
    ],
    keyHighlights: ["Honest estimates", "Local team", "Reliable scheduling"],
    blogs: []
  },
  {
    id: "7",
    companyName: "San Antonio Water Works",
    ownerName: "Nina Patel",
    rating: 4.9,
    reviewCount: 241,
    logo: "https://randomuser.me/api/portraits/women/55.jpg",
    services: ["Water Heater", "Tankless Install", "Pipe Repair", "Leak Repair", "Fixture Installation"],
    priceRange: "$115/hr",
    averageCost: 455,
    availability: "24/7 Emergency",
    isVerified: true,
    isEmergency: true,
    location: "San Antonio, TX",
    city: "San Antonio",
    state: "TX",
    phone: "(210) 555-7722",
    email: "hello@sanantoniowaterworks.com",
    website: "https://sanantoniowaterworks.com",
    description: "San Antonio Water Works is known for fast response, premium water heater service, and transparent pricing.",
    yearsInBusiness: 15,
    established: 2011,
    licenseNumber: "PL-77442",
    insurance: "$3M liability",
    certifications: ["EPA", "GreenPlumber"],
    serviceAreas: ["San Antonio, TX", "New Braunfels, TX", "Boerne, TX"],
    specializations: ["Water Heaters", "Emergency Plumbing", "Installations"],
    responseTime: "< 30 min",
    teamSize: 21,
    socialLinks: {
      facebook: "https://facebook.com/SanAntonioWaterWorks",
      instagram: "https://instagram.com/SanAntonioWaterWorks"
    },
    warranty: "2 years",
    paymentMethods: ["Cash", "Credit Card", "Financing"],
    languages: ["English", "Spanish"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800"
      ],
      videos: []
    },
    distance: 8.4,
    discount: "20% off water heater install",
    promoCode: "HEAT20",
    branches: [
      { name: "Downtown SA", lat: 29.4241, lng: -98.4936, address: "210 Riverwalk Ave, San Antonio, TX 78205" }
    ],
    projects: [
      {
        title: "Hotel Tankless Conversion",
        client: "Mission View Hotel",
        description: "Converted a 60-room hotel from tank heaters to high-efficiency tankless systems.",
        image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800",
        year: 2024,
        clientRating: 5.0,
        clientReview: "Energy savings and better hot water performance.",
        durationDays: 12,
        projectCost: 68000
      }
    ],
    keyHighlights: ["24/7 support", "Fast arrivals", "Top-rated service"],
    blogs: []
  },
  {
    id: "8",
    companyName: "Dallas Rapid Plumbers",
    ownerName: "Chris Bennett",
    rating: 4.5,
    reviewCount: 176,
    logo: "https://randomuser.me/api/portraits/men/14.jpg",
    services: ["Emergency Service", "Sewer Line", "Leak Repair", "Toilet Repair", "Drain Cleaning"],
    priceRange: "$105/hr",
    averageCost: 390,
    availability: "Evenings available",
    isVerified: true,
    isEmergency: true,
    location: "Dallas, TX",
    city: "Dallas",
    state: "TX",
    phone: "(214) 555-6677",
    email: "service@dallasrapidplumbers.com",
    website: "https://dallasrapidplumbers.com",
    description: "Dallas Rapid Plumbers handles emergency plumbing calls, sewer repairs, and ongoing maintenance contracts.",
    yearsInBusiness: 10,
    established: 2016,
    licenseNumber: "PL-90991",
    insurance: "$2M liability",
    certifications: ["OSHA", "EPA"],
    serviceAreas: ["Dallas, TX", "Plano, TX", "Irving, TX"],
    specializations: ["Emergency", "Sewer", "Maintenance"],
    responseTime: "< 1 hour",
    teamSize: 14,
    socialLinks: {
      facebook: "https://facebook.com/DallasRapidPlumbers"
    },
    warranty: "1 year",
    paymentMethods: ["Cash", "Check", "Credit Card"],
    languages: ["English", "Spanish"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
      ],
      videos: []
    },
    distance: 9.1,
    discount: "Free estimate",
    promoCode: "RAPIDFREE",
    branches: [
      { name: "Uptown", lat: 32.7767, lng: -96.797, address: "500 Main St, Dallas, TX 75201" }
    ],
    projects: [
      {
        title: "Retail Center Pipe Repair",
        client: "Oak Lawn Shops",
        description: "Repaired slab leak and replaced damaged supply lines for multiple retail units.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
        year: 2023,
        clientRating: 4.6,
        clientReview: "Fast repairs with minimal disruption.",
        durationDays: 3,
        projectCost: 14600
      }
    ],
    keyHighlights: ["Emergency-ready", "Transparent rates", "Licensed techs"],
    blogs: []
  },
  {
    id: "9",
    companyName: "Seattle PureFlow Plumbing",
    ownerName: "Olivia Turner",
    rating: 4.7,
    reviewCount: 164,
    logo: "https://randomuser.me/api/portraits/women/63.jpg",
    services: ["Leak Repair", "Water Heater", "Drain Cleaning", "Pipe Repair", "Fixture Installation"],
    priceRange: "$108/hr",
    averageCost: 405,
    availability: "Same-day",
    isVerified: true,
    isEmergency: true,
    location: "Seattle, WA",
    city: "Seattle",
    state: "WA",
    phone: "(206) 555-4099",
    email: "hello@seattlepureflow.com",
    website: "https://seattlepureflow.com",
    description: "Seattle PureFlow Plumbing offers fast residential plumbing service with licensed technicians and transparent pricing.",
    yearsInBusiness: 12,
    established: 2014,
    licenseNumber: "PL-44019",
    insurance: "$2M liability",
    certifications: ["EPA", "OSHA"],
    serviceAreas: ["Seattle, WA", "Bellevue, WA", "Kirkland, WA"],
    specializations: ["Residential", "Leak Repair", "Water Heaters"],
    responseTime: "< 1 hour",
    teamSize: 13,
    socialLinks: {
      facebook: "https://facebook.com/SeattlePureFlow",
      instagram: "https://instagram.com/SeattlePureFlow"
    },
    warranty: "1 year",
    paymentMethods: ["Cash", "Credit Card", "Financing"],
    languages: ["English", "Spanish"],
    media: {
      images: [
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"
      ],
      videos: []
    },
    distance: 10.2,
    discount: "12% off first service",
    promoCode: "PURE12",
    branches: [
      { name: "Downtown Seattle", lat: 47.6062, lng: -122.3321, address: "415 Pine St, Seattle, WA 98101" }
    ],
    projects: [
      {
        title: "Multi-unit Leak Remediation",
        client: "Pine Street Apartments",
        description: "Repaired multiple hidden leaks and replaced damaged supply lines for a 30-unit complex.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        year: 2024,
        clientRating: 4.8,
        clientReview: "Professional work and clear communication throughout.",
        durationDays: 4,
        projectCost: 18800
      }
    ],
    keyHighlights: ["Same-day support", "Licensed team", "Clear pricing"],
    blogs: []
  },
];

// Build final plumbers array with default blogs and faqs
export const plumbers: Plumber[] = rawPlumbers.map((plumber) => {
  const typedPlumber = plumber as Plumber;
  const projects = enrichProjects(typedPlumber);

  return {
    ...typedPlumber,
    projects,
    blogs: typedPlumber.blogs?.length ? typedPlumber.blogs : buildDefaultBlogs(typedPlumber),
    faqs: typedPlumber.faqs?.length ? typedPlumber.faqs : buildDefaultFaqs(typedPlumber),
    teamMembers: typedPlumber.teamMembers?.length ? typedPlumber.teamMembers : buildDefaultTeam(typedPlumber),
  };
});
