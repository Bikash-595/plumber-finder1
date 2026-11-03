import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// Experience, specialties, languages and response time (the facts under your name on your profile).
// Saved to /api/freelancers/overview.
export const overviewConfig = {
  section: "freelancer-overview",
  apiEndpoint: "/freelancers/overview",
  title: "Overview",
  description: "Tell customers about your experience and what you specialise in.",
  defaults: { bio: "", specialties: "", certifications: "", languages: "", responseTime: "", jobsCompleted: "", averageCost: "", emergencyAvailable: false },
  fields: [
    { name: "bio", label: "About You", type: "textarea" },
    { name: "specialties", label: "Specialties", placeholder: "Leak repair, water heaters, drains" },
    { name: "languages", label: "Languages", placeholder: "English, Spanish" },
    { name: "certifications", label: "Certifications", placeholder: "Separate with commas" },
    { name: "responseTime", label: "Typical Response Time", placeholder: "Within 2 hours" },
    { name: "jobsCompleted", label: "Jobs Completed", type: "number" },
    { name: "averageCost", label: "Average Job Cost (USD)", type: "number" },
    { name: "emergencyAvailable", label: "Available for emergencies", type: "checkbox" },
  ] satisfies ProfileField[],
};
