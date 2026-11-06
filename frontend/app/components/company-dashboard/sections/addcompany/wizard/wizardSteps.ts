// The onboarding wizard's steps and the fields each one asks for (saved per step).
export const steps = [
  {
    id: "company-information",
    title: "Company Information",
    description: "Capture the public profile and business identity details.",
    fields: [
      { 
        name: "companyName", 
        label: "Company Name", 
        type: "text", 
        placeholder: "Premier Plumbing Co." 
      },
      {
        name: "tagline", 
        label: "Company Tagline", 
        type: "text", 
        placeholder: "Fast, friendly plumbing services." 
      },
      { 
        name: "slogan", 
        label: "Company Slogan", 
        type: "text", 
        placeholder: "Your trusted leak repair experts." 
      },

      { 
        name: "shortDescription", 
        label: "Short Description", 
        type: "textarea", 
        placeholder: "Reliable plumbing for homes and businesses." 
      },
      { 
        name: "longDescription", 
        label: "Long Description", 
        type: "textarea", 
        placeholder: "Premier Plumbing provides residential and commercial plumbing services across New York...", 
        rows: 6 
      },
      { 
        name: "missionStatement", 
        label: "Mission Statement", 
        type: "textarea", 
        placeholder: "Deliver exceptional plumbing service with integrity and speed.", 
        rows: 4 
      },
      { 
        name: "visionStatement", 
        label: "Vision Statement", 
        type: "textarea", 
        placeholder: "To be the most trusted plumbing partner in every community.", 
        rows: 4 
      },
    ],
  },









  {
    id: "business-profile",
    title: "Business Profile",
    description: "Add the company background, operations, and scale details.",
    fields: [
      { 
        name: "companyHistory", 
        label: "Company History", 
        type: "textarea", 
        placeholder: "Founded in 2003, Premier Plumbing has grown from a two-person team...", 
        rows: 5 
      },
      { 
        name: "founderStory", 
        label: "Founder Story", 
        type: "textarea", 
        placeholder: "Our founder started as an apprentice plumber...", 
        rows: 4 
      },
      { 
        name: "businessGoals", 
        label: "Business Goals", 
        type: "textarea", 
        placeholder: "Expand into commercial maintenance contracts and emergency repair services.", 
        rows: 4 
      },
      { 
        name: "coreValues", 
        label: "Core Values", 
        type: "textarea", 
        placeholder: "Integrity, responsiveness, quality workmanship.", 
        rows: 4 
      },

      { 
        name: "businessRegistrationNumber", 
        label: "Business Registration Number", 
        type: "text", 
        placeholder: "NY-PL-2024-009" 
      },
      { 
        name: "taxIdentificationNumber", 
        label: "Tax Identification Number", 
        type: "text", 
        placeholder: "98-7654321" 
      },
      { 
        name: "vatGstNumber", 
        label: "VAT/GST Number", 
        type: "text", 
        placeholder: "US123456789" 
      },
      { 
        name: "employerIdentificationNumber", 
        label: "Employer Identification Number", 
        type: "text", 
        placeholder: "12-3456789" 
      },
      { 
        name: "companyType", 
        label: "Company Type", 
        type: "text", 
        placeholder: "Plumbing Contractor" 
      },
      { 
        name: "businessStructure", 
        label: "Business Structure", 
        type: "select", 
        options: ["Sole Proprietorship", "LLC", "Corporation", "Partnership"] 
      },

      { 
        name: "yearEstablished", 
        label: "Year Established", 
        type: "number", 
        placeholder: "2003" 
      },
      { 
        name: "numberOfEmployees", 
        label: "Number Of Employees", 
        type: "number", 
        placeholder: "42" 
      },
      { 
        name: "numberOfTechnicians", 
        label: "Number Of Technicians", 
        type: "number", 
        placeholder: "27" 
      },
      { 
        name: "numberOfVehicles", 
        label: "Number Of Vehicles", 
        type: "number", 
        placeholder: "14" 
      },
      { 
        name: "companySize", 
        label: "Company Size", 
        type: "text", 
        placeholder: "Small Business" 
      },
      { 
        name: "languagesSpoken", 
        label: "Languages Spoken", 
        type: "text", 
        placeholder: "English, Spanish" 
      },
      { 
        name: "serviceCapacity", 
        label: "Service Capacity", 
        type: "text", 
        placeholder: "High-volume residential and commercial service." 
      },
      { 
        name: "annualRevenueRange", 
        label: "Annual Revenue Range", 
        type: "text", 
        placeholder: "$1M - $5M" 
      },
      { 
        name: "operatingRegions", 
        label: "Operating Regions", 
        type: "text", 
        placeholder: "NYC Metro, Hudson Valley, Long Island" 
      },
    ],
  },







  {
    id: "branding",
    title: "Branding & Media",
    description: "Capture the visual identity, marketing assets, and SEO metadata.",
    fields: [
      { 
        name: "companyLogo", 
        label: "Company Logo URL", 
        type: "url", 
        placeholder: "https://.../logo.png" 
      },
      { 
        name: "darkLogo", 
        label: "Dark Logo URL", 
        type: "url", 
        placeholder: "https://.../logo-dark.png" 
      },
      { 
        name: "lightLogo", 
        label: "Light Logo URL", 
        type: "url", 
        placeholder: "https://.../logo-light.png" 
      },
      { 
        name: "favicon", 
        label: "Favicon URL", 
        type: "url", 
        placeholder: "https://.../favicon.ico" 
      },
      { 
        name: "coverImage", 
        label: "Cover Image URL", 
        type: "url", 
        placeholder: "https://.../cover.jpg" 
      },
      { 
        name: "heroBanner", 
        label: "Hero Banner URL", 
        type: "url", 
        placeholder: "https://.../hero.jpg" 
      },
      { 
        name: "mobileBanner", 
        label: "Mobile Banner URL", 
        type: "url", 
        placeholder: "https://.../mobile-banner.jpg" 
      },
      { 
        name: "introVideo", 
        label: "Company Intro Video URL", 
        type: "url", 
        placeholder: "https://.../video.mp4" 
      },
      { 
        name: "brandColors", 
        label: "Brand Colors", 
        type: "text", 
        placeholder: "#003366, #FFD60A, #ffffff" 
      },
      { 
        name: "brandTypography", 
        label: "Brand Typography", 
        type: "text", 
        placeholder: "Inter, Roboto, Poppins" 
      },
      { 
        name: "seoTitle", 
        label: "SEO Title", 
        type: "text", 
        placeholder: "Best Plumbing Services in NYC | Premier Plumbing" 
      },
      { 
        name: "seoKeywords", 
        label: "SEO Keywords", 
        type: "text", 
        placeholder: "plumbing, leak repair, drain cleaning" 
      },
    ],
  },











  {
    id: "gallery",
    title: "Gallery & Media",
    description: "Upload multiple images and videos that showcase the company, service work, and video stories.",
    fields: [
      { 
        name: "galleryDescription", 
        label: "Gallery Description", 
        type: "textarea", 
        placeholder: "Showcase your best projects and team in a visual gallery.", 
        rows: 4 
      },
    ],
  },
  {
    id: "contact",
    title: "Contact & Location",
    description: "Add phone, email, support channels and the primary address.",
    fields: [
      { 
        name: "primaryPhone", 
        label: "Primary Phone", 
        type: "tel", 
        placeholder: "(212) 555-1234" 
      },
      { 
        name: "secondaryPhone", 
        label: "Secondary Phone", 
        type: "tel", 
        placeholder: "(212) 555-5678" 
      },
      { 
        name: "whatsapp", 
        label: "WhatsApp", 
        type: "tel", 
        placeholder: "+1 917 555 1234" 
      },
      { 
        name: "smsNumber", 
        label: "SMS Number", 
        type: "tel", 
        placeholder: "+1 917 555 4321" 
      },
      { 
        name: "email", 
        label: "Email", 
        type: "email", 
        placeholder: "contact@premierplumbing.com" 
      },
      { 
        name: "supportEmail", 
        label: "Support Email", 
        type: "email", 
        placeholder: "support@premierplumbing.com" 
      },
      { 
        name: "salesEmail", 
        label: "Sales Email", 
        type: "email", 
        placeholder: "sales@premierplumbing.com" 
      },
      { 
        name: "emergencyHotline", 
        label: "Emergency Hotline", 
        type: "tel", 
        placeholder: "+1 800 123 4567" 
      },
      { 
        name: "website", 
        label: "Website", 
        type: "url", 
        placeholder: "https://premierplumbing.com" 
      },
      { 
        name: "contactPerson", 
        label: "Contact Person", 
        type: "text", 
        placeholder: "Alicia Torres" 
      },
      { 
        name: "contactPersonRole", 
        label: "Contact Person Role", 
        type: "text", 
        placeholder: "Operations Manager" 
      },
    ],
  },











  {
    id: "location",
    title: "Location & Service Area",
    description: "Define all operating locations, service cities, and mapping details.",
    fields: [
      { 
        name: "headquarters", 
        label: "Headquarters Address", 
        type: "textarea", 
        placeholder: "123 Main St, New York, NY 10001", 
        rows: 3 
      },
      { 
        name: "branchLocations", 
        label: "Branch Locations", 
        type: "textarea", 
        placeholder: "45 Hudson Ave, Brooklyn, NY 11201\n98 Main St, White Plains, NY 10601", 
        rows: 4 
      },
      { 
        name: "franchiseLocations", 
        label: "Franchise Locations", 
        type: "textarea", 
        placeholder: "Chicago, IL; Dallas, TX", 
        rows: 3 
      },
      { 
        name: "serviceRadius", 
        label: "Service Radius (miles)", 
        type: "text", 
        placeholder: "50" 
      },
      { 
        name: "multipleServiceAreas", 
        label: "Multiple Service Areas", 
        type: "textarea", 
        placeholder: "Manhattan, Brooklyn, Queens", 
        rows: 3 
      },
      { 
        name: "multipleCities", 
        label: "Multiple Cities", 
        type: "text", 
        placeholder: "New York, Jersey City" 
      },
      { 
        name: "multipleStates", 
        label: "Multiple States", 
        type: "text", 
        placeholder: "NY, NJ" 
      },
      { 
        name: "operatingCountries", 
        label: "Operating Countries", 
        type: "text", 
        placeholder: "United States" 
      },
      { 
        name: "googleMapsIntegration", 
        label: "Google Maps Embed URL", 
        type: "url", 
        placeholder: "https://maps.google.com/..." 
      },
      { 
        name: "latitude", 
        label: "Latitude", 
        type: "text", 
        placeholder: "40.7128" 
      },
      { 
        name: "longitude", 
        label: "Longitude", 
        type: "text", 
        placeholder: "-74.0060" 
      },
    ],
  },
















  {
    id: "operations",
    title: "Business Hours & Operations",
    description: "Add working hours, emergency availability and special closures.",
    fields: [
      { 
        name: "dailyHours", 
        label: "Daily Hours", 
        type: "textarea", 
        placeholder: "Mon-Fri 8:00 AM - 8:00 PM\nSat 9:00 AM - 5:00 PM", 
        rows: 4 
      },
      { 
        name: "holidayHours", 
        label: "Holiday Hours", 
        type: "textarea", 
        placeholder: "Closed on Thanksgiving and Christmas.", 
        rows: 3 
      },
      { 
        name: "emergencyHours", 
        label: "Emergency Hours", 
        type: "textarea", 
        placeholder: "24/7 emergency response available.", 
        rows: 3 
      },
      { 
        name: "availability24x7", 
        label: "24/7 Availability", 
        type: "select", 
        options: ["Yes", "No"] 
      },
      { 
        name: "seasonalHours", 
        label: "Seasonal Hours", 
        type: "textarea", 
        placeholder: "Winter: Mon-Fri 7:00 AM - 6:00 PM", 
        rows: 3 
      },
      { 
        name: "specialClosures", 
        label: "Special Closures", 
        type: "textarea", 
        placeholder: "Closed for Memorial Day weekend.", 
        rows: 3 
      },
    ],
  },















  {
    id: "services",
    title: "Services & Categories",
    description: "Create service packages and categories used on the public profile.",
    fields: [
      { 
        name: "serviceCategory", 
        label: "Service Category", 
        type: "text", 
        placeholder: "Emergency Plumbing" 
      },
      { 
        name: "serviceName", 
        label: "Service Name", 
        type: "text", 
        placeholder: "Burst Pipe Repair" 
      },
      { 
        name: "serviceDescription", 
        label: "Service Description", 
        type: "textarea", 
        placeholder: "Fast repair for burst pipes with guaranteed workmanship.", 
        rows: 4 
      },
      { 
        name: "serviceFeatures", 
        label: "Service Features", 
        type: "textarea", 
        placeholder: "24/7 response, free inspection, warranty", 
        rows: 3 
      },
      { 
        name: "serviceBenefits", 
        label: "Service Benefits", 
        type: "textarea", 
        placeholder: "Faster repairs, lower damage risk, fixed pricing.", 
        rows: 3 
      },
      { 
        name: "serviceAreas", 
        label: "Service Areas", 
        type: "text", 
        placeholder: "Manhattan, Bronx, Westchester" 
      },
      { 
        name: "servicePricing", 
        label: "Service Pricing", 
        type: "text", 
        placeholder: "$99 - $499" 
      },
      { 
        name: "estimatedDuration", 
        label: "Estimated Duration", 
        type: "text", 
        placeholder: "1 - 3 hours" 
      },
      { 
        name: "warranty", 
        label: "Warranty", 
        type: "text", 
        placeholder: "1 year workmanship warranty" 
      },
      { 
        name: "serviceFaqs", 
        label: "Service FAQs", 
        type: "textarea", 
        placeholder: "What is included?\nDo you offer emergency service?", 
        rows: 4 
      },
    ],
  },
];
