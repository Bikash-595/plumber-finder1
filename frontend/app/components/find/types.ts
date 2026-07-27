
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
