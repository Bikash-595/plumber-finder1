"use client";

export const PROFILE_STORAGE_PREFIX = "plumberfinder_business_profile_";

// This is seeded from the same shape used by the public plumber profiles. It is
// deliberately local until the Mongo/Mongoose API is connected.
export const companyProfileSeed = {
  companyName: "Dallas Rapid Plumbers",
  ownerName: "Chris Bennett",
  companyType: "Plumbing Contractor",
  yearsInBusiness: "10",
  licenseNumber: "PL-90991",
  insurance: "$2M liability",
  certifications: "OSHA, EPA",
  shortDescription: "Emergency plumbing, sewer repairs, and maintenance contracts.",
  fullDescription: "Dallas Rapid Plumbers handles emergency calls, sewer repairs, and ongoing maintenance contracts across Dallas.",
  mission: "Make urgent plumbing help simple, fast, and dependable.",
  vision: "Be Dallas' most trusted local plumbing team.",
  whyChooseUs: "Licensed technicians, transparent rates, and emergency-ready response.",
  phone: "(214) 555-6677",
  email: "service@dallasrapidplumbers.com",
  website: "https://dallasrapidplumbers.com",
  whatsapp: "",
  facebook: "https://facebook.com/DallasRapidPlumbers",
  instagram: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
  coverImage: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1600",
  logo: "https://randomuser.me/api/portraits/men/14.jpg",
};

export function readProfileDraft<T extends Record<string, unknown>>(section: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(`${PROFILE_STORAGE_PREFIX}${section}`);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveProfileDraft(section: string, values: unknown, draft = false) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(`${PROFILE_STORAGE_PREFIX}${section}`, JSON.stringify(values));
  }
  return draft ? "Draft saved on this device." : "Changes saved on this device.";
}
