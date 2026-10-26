
// export interface Plumber {
//   id: string;
//   companyName: string;
//   ownerName: string;
//   rating: number;
//   reviewCount: number;
//   logo: string;
//   services: string[];
//   priceRange: string;
//   averageCost: number;
//   availability: string;
//   isVerified: boolean;
//   isEmergency: boolean;
//   location: string;
//   phone: string;
//   email: string;
//   website?: string;
//   description: string;
//   yearsInBusiness: number;
//   established: number;
//   licenseNumber?: string;
//   insurance: string;
//   certifications: string[];
//   serviceAreas: string[];
//   specializations: string[];
//   responseTime: string;
//   teamSize: number;
//   socialLinks?: {
//     facebook?: string;
//     twitter?: string;
//     instagram?: string;
//     linkedin?: string;
//   };
//   warranty: string;
//   paymentMethods: string[];
//   languages: string[];
//   media?: {
//     images: string[];   // array of image URLs
//     videos: string[];   // array of YouTube embed URLs or video file URLs
//   };
// }







export interface Plumber {
  id: string;
  companyName: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  logo: string;
  services: string[];
  priceRange: string;
  averageCost: number;
  availability: string;
  isVerified: boolean;
  isEmergency: boolean;
  location: string;
  city?: string;
  state?: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  yearsInBusiness: number;
  established: number;
  licenseNumber?: string;
  insurance: string;
  certifications: string[];
  serviceAreas: string[];
  specializations: string[];
  responseTime: string;
  teamSize: number;
  teamMembers?: TeamMember[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  warranty: string;
  paymentMethods: string[];
  languages: string[];
  media?: {
    images: string[];
    videos: string[];
  };
  discount?: string;
  promoCode?: string;
  serviceDetails?: ServiceDetail[]; // live profiles: services with price, duration, what's included
  couponCount?: number; // live listings: coupon codes across all current offers
  offers?: PlumberOffer[]; // live profiles: every current offer with its coupon codes
  branches?: { name: string; lat: number; lng: number; address: string }[];
  // ... existing fields ...
  projects: {
    id?: string;
    title: string;
    client: string;
    description: string;
    image: string;
    year: number;
    clientRating?: number;
    clientReview?: string;
    durationDays?: number;
    projectCost?: number;
    clientDetails?: {
      name: string;
      type: string;
      location: string;
      contactPerson: string;
    };
    projectDetails?: {
      category: string;
      scope: string;
      challenge: string;
      solution: string;
      materials: string[];
      teamSize: number;
      warranty: string;
      completedAt: string;
    };
  }[];
  keyHighlights?: string[];
  distance?: number; 
  blogs?: BlogPost[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  // Companies added through the dashboard (live listings) also carry these.
  providerType?: "company" | "freelancer"; // demo plumbers are companies
  hourlyRate?: number; // freelancers
  slug?: string; // live companies: public URL is /company/<slug>
  coordinates?: { lat: number; lng: number }; // base location, for "x mi away"
  blogCount?: number; // cards: published posts (full posts are only loaded on the profile)
  galleryCounts?: { images: number; videos: number }; // cards: gallery photos/videos (loaded by the card slideshow)
  serviceAreaDetails?: { name: string; services: string[]; address?: string; radius?: number; latitude?: number; longitude?: number }[]; // areas with the services offered there
  baseRadius?: number; // miles around the base location
  baseLocation?: string; // where a live company or freelancer is based (Service Areas)
  tagline?: string;
  coverImage?: string; // profile header banner (live companies and freelancers)
  coverImages?: string[]; // several banner photos, shown as a slideshow (the first is coverImage)
  openingHours?: OpeningHours;
  reviews?: PlumberReview[];
  about?: Partial<Record<"slogan" | "longDescription" | "missionStatement" | "visionStatement" | "companyHistory" | "founderStory" | "coreValues", string>>;


}

/** A special offer with one or more coupon codes, each with its own discount. */
export interface PlumberOffer {
  id: string;
  title: string;
  description?: string;
  image?: string;
  endDate?: string;
  coupons: { code: string; discount: string; appliesTo?: string; minSpend?: number; terms?: string }[];
}

/** A service as the company/freelancer described it in its dashboard. */
export interface ServiceDetail {
  id: string;
  name: string;
  category?: string;
  description?: string;
  price?: string; // e.g. "From $89", "$95/hr", "Free quote"
  duration?: string;
  includes: string[];
  warranty?: string;
  emergency: boolean;
  featured: boolean;
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  specialties: string[];
  experience: number;
  experienceMonths?: number;
  projectsInvolved?: number;
  projectsCompleted?: number;
  careerStartMonth?: number;
  careerStartYear?: number;
  joinedCompanyMonth?: number;
  joinedCompanyYear?: number;
  certificates: string[];
  licenseNumber?: string;
  availability: string;
  bio: string;
}



export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  content: string;          // HTML or markdown
  image: string;
  video?: string | null;    // optional YouTube embed
  author: string;
  date: string;
  readTime: number;         // minutes
  readCount: number;
  reactions: { like: number; love: number; helpful: number };
  comments: { name: string; comment: string; date: string }[];
}

export interface OpeningHoursDay {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  isOpen: boolean;
  opensAt: string; // "HH:MM", 24-hour
  closesAt: string;
}

export interface OpeningHours {
  weekly: OpeningHoursDay[];
  notes: { label: string; value: string }[];
}

export interface PlumberReview {
  name: string;
  rating: number;
  text: string;
  date: string;
  photo?: string;
}
