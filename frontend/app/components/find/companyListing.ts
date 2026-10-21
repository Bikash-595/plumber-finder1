import type { Plumber } from "./types";

// Shape returned by the backend's GET /companies/public and /companies/public/:id.
export type CompanyListing = {
  _id: string;
  companyName: string;
  logo?: string;
  coverImage?: string;
  services?: string[];
  serviceAreas?: string[];
  location?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
};

export function companyListingToPlumber(company: CompanyListing): Plumber {
  return {
    id: company._id,
    companyName: company.companyName,
    ownerName: company.companyName,
    rating: company.rating || 0,
    reviewCount: company.reviewCount || 0,
    logo: company.logo || company.coverImage || "",
    services: company.services || [],
    priceRange: "Contact for pricing",
    averageCost: 0,
    availability: "Available",
    isVerified: true,
    isEmergency: false,
    location: company.location || [company.city, company.state].filter(Boolean).join(", "),
    city: company.city,
    state: company.state,
    phone: company.phone || "",
    email: company.email || "",
    website: company.website,
    description: company.description || "",
    yearsInBusiness: 0,
    established: new Date().getFullYear(),
    insurance: "",
    certifications: [],
    serviceAreas: company.serviceAreas || [],
    specializations: company.services || [],
    responseTime: "Contact for availability",
    teamSize: 0,
    warranty: "",
    paymentMethods: [],
    languages: [],
    media: { images: company.coverImage ? [company.coverImage] : [], videos: [] },
    projects: [],
  };
}
