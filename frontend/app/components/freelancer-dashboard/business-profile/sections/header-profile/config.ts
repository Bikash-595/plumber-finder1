import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// The top of the public profile: photo, cover photos, name, trade, bio and credentials.
// Saving it creates the freelancer's public listing (/api/freelancers/header-profile).
export const headerProfileConfig = {
  section: "freelancer-header-profile",
  apiEndpoint: "/freelancers/header-profile",
  title: "Your Profile",
  description: "Your name, trade, short bio, and photo appear at the top of your public profile. Saving this registers you in the public freelancer directory.",
  defaults: { photo: "", coverImages: "", displayName: "", headline: "", bio: "", yearsExperience: "", licenseNumber: "", insurance: "", hourlyRate: "", phone: "", city: "", state: "", isAvailable: true, published: true },
  fields: [
    { name: "photo", label: "Profile Photo", type: "image" },
    { name: "coverImages", label: "Cover Photos", type: "images", maxImages: 8, legacyField: "coverImage", placeholder: "Add up to 8 wide photos (vans, team, finished jobs). They change automatically at the top of your profile; the first one is the main cover." },
    { name: "displayName", label: "Display Name", placeholder: "e.g. Dana Pipes" },
    { name: "headline", label: "Trade / Headline", placeholder: "e.g. Licensed Master Plumber" },
    { name: "bio", label: "Short Bio (up to 600 characters, shown at the top of your profile and on your card)", type: "textarea", placeholder: "e.g. Independent master plumber with 12 years of experience in leak detection, water heaters and bathroom remodels. I answer every call myself and give upfront quotes." },
    { name: "yearsExperience", label: "Years of Experience", type: "number" },
    { name: "hourlyRate", label: "Hourly Rate (USD)", type: "number" },
    { name: "licenseNumber", label: "License Number" },
    { name: "insurance", label: "Insurance" },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
    { name: "isAvailable", label: "Available for new jobs", type: "checkbox" },
    { name: "published", label: "Show me in the public directory", type: "checkbox" },
  ] satisfies ProfileField[],
};
