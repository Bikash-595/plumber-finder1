// The Add Company wizard's steps. Each step can be saved on its own; only the fields
// (and lists) named here are stored for that step — anything else in the body is ignored.
export const onboardingSteps = [
  { id: "company-information", fields: ["companyName", "tagline", "slogan", "shortDescription", "longDescription", "missionStatement", "visionStatement"], required: ["companyName"] },
  { id: "business-profile", fields: ["companyHistory", "founderStory", "businessGoals", "coreValues", "businessRegistrationNumber", "taxIdentificationNumber", "vatGstNumber", "employerIdentificationNumber", "companyType", "businessStructure", "yearEstablished", "numberOfEmployees", "numberOfTechnicians", "numberOfVehicles", "companySize", "languagesSpoken", "serviceCapacity", "annualRevenueRange", "operatingRegions"] },
  { id: "branding", fields: ["companyLogo", "darkLogo", "lightLogo", "favicon", "coverImage", "heroBanner", "mobileBanner", "introVideo", "brandColors", "brandTypography", "seoTitle", "seoKeywords"] },
  { id: "gallery", fields: ["galleryDescription"], lists: ["galleryImages", "galleryVideos"] },
  { id: "contact", fields: ["primaryPhone", "secondaryPhone", "whatsapp", "smsNumber", "email", "supportEmail", "salesEmail", "emergencyHotline", "website", "contactPerson", "contactPersonRole"] },
  { id: "location", fields: ["headquarters", "branchLocations", "franchiseLocations", "serviceRadius", "multipleServiceAreas", "multipleCities", "multipleStates", "operatingCountries", "googleMapsIntegration", "latitude", "longitude"], lists: ["locations"] },
  { id: "operations", fields: ["dailyHours", "holidayHours", "emergencyHours", "availability24x7", "seasonalHours", "specialClosures"], lists: ["weeklyHours"] },
  { id: "services", fields: ["serviceCategory", "serviceName", "serviceDescription", "serviceFeatures", "serviceBenefits", "serviceAreas", "servicePricing", "estimatedDuration", "warranty", "serviceFaqs"], lists: ["services"] },
];

export const onboardingFields = onboardingSteps.flatMap((step) => step.fields);

// Allowed keys for each repeatable list.
export const onboardingLists = {
  services: ["name", "category", "description", "pricing", "duration", "warranty", "areas"],
  locations: ["label", "address", "city", "state", "country", "zipCode", "latitude", "longitude", "radius"],
  galleryImages: ["url", "caption"],
  galleryVideos: ["url", "title"],
  weeklyHours: ["day", "isOpen", "opensAt", "closesAt"],
};
// weeklyHours rows are validated by shared/openingHours.js (day names, HH:MM times).

export const onboardingLimits = { fieldLength: 5000, itemFieldLength: 2000, listItems: 50 };
