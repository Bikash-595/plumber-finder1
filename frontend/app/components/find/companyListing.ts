import type { BlogPost, OpeningHours, OpeningHoursDay, Plumber, PlumberReview, TeamMember } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";

type Offer = { title?: string; discount?: string; promoCode?: string };

// Shape returned by the backend's GET /companies/public (one card per company).
export type CompanyListing = {
  _id: string;
  slug?: string;
  companyName: string;
  tagline?: string;
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
  createdAt?: string;
  verified?: boolean;
  ownerName?: string;
  established?: number;
  yearsInBusiness?: number;
  teamSize?: number;
  licenseNumber?: string;
  insurance?: string;
  certifications?: string;
  responseTime?: string;
  averageCost?: number;
  warranty?: string;
  languages?: string;
  offer?: Offer;
  isEmergency?: boolean;
  weeklyHours?: OpeningHoursDay[];
  coordinates?: { lat: number; lng: number };
  blogCount?: number;
  teamPreview?: { name: string; role?: string }[];
};

type Media = { _id: string; type?: string; media: string; mediaKind?: "image" | "video"; caption?: string };

// GET /companies/public/:id/profile — the card fields plus every public section.
export type CompanyProfile = Omit<CompanyListing, "services"> & {
  services?: { name: string; price?: string; emergency?: boolean; featured?: boolean }[];
  header?: { companyName?: string; ownerName?: string; logo?: string; coverImage?: string } | null;
  about?: Record<string, string>;
  contact?: Record<string, string>;
  hours?: Record<string, string> & { weeklyHours?: OpeningHoursDay[] };
  branches?: { label?: string; address?: string; city?: string; state?: string; latitude?: string; longitude?: string }[];
  gallery?: Media[];
  projects?: { _id: string; title: string; client?: string; location?: string; service: string; completedDate?: string; duration?: string; budget?: string; description: string; challenge?: string; solution?: string; results?: string; beforeImage?: string; afterImage?: string; testimonial?: string; rating?: number; createdAt?: string }[];
  reviews?: { _id: string; customer: string; rating: number; review: string; photo?: string; createdAt: string }[];
  team?: { _id: string; name: string; role?: string; bio?: string; photo?: string; specialties?: string[]; experienceYears?: number; certificates?: string[]; licenseNumber?: string; availability?: string; joinedYear?: number }[];
  faqs?: { question: string; answer: string }[];
  blogs?: { _id: string; slug: string; title: string; category?: string; excerpt: string; content: string; coverImage?: string; author?: string; publishDate?: string; tags?: string[] }[];
  offers?: (Offer & { description?: string })[];
  booking?: { emergencyBooking?: boolean } | null;
  serviceArea?: { areaDetails?: { name: string; services?: string[] }[]; branchLocation?: string; latitude?: number; longitude?: number } | null;
  socialLinks?: Partial<Record<"facebook" | "instagram" | "twitter" | "linkedin" | "youtube" | "tiktok", string>>;
};

const dayNames: OpeningHoursDay["day"][] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const toMinutes = (time: string) => { const [h, m] = time.split(":").map(Number); return h * 60 + m; };

/** "Open now" / "Closed now" from the weekly hours (in the visitor's local time), or null without hours. */
export function openNowLabel(weekly: OpeningHoursDay[] | undefined, now = new Date()): string | null {
  if (!weekly?.length) return null;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = weekly.find((day) => day.day === dayNames[now.getDay()]);
  const yesterday = weekly.find((day) => day.day === dayNames[(now.getDay() + 6) % 7]);
  const openToday = today?.isOpen && (toMinutes(today.closesAt) > toMinutes(today.opensAt)
    ? minutes >= toMinutes(today.opensAt) && minutes < toMinutes(today.closesAt)
    : minutes >= toMinutes(today.opensAt)); // closes after midnight
  const openFromYesterday = yesterday?.isOpen && toMinutes(yesterday.closesAt) < toMinutes(yesterday.opensAt) && minutes < toMinutes(yesterday.closesAt);
  return openToday || openFromYesterday ? "Open now" : "Closed now";
}

// next/image only renders configured hosts; uploads (data: URLs) and site images always work.
const imageHosts = ["randomuser.me", "images.unsplash.com", "logo.clearbit.com", "api.dicebear.com", "upload.wikimedia.org"];
export function displayableImage(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith("data:image/") || src.startsWith("/")) return src;
  try { return imageHosts.includes(new URL(src).hostname) ? src : ""; } catch { return ""; }
}

const splitList = (value?: string) => (value ?? "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
const yearOf = (value?: string) => (value ? new Date(value).getFullYear() : new Date().getFullYear());
const numberFrom = (value?: string) => { const n = Number(String(value ?? "").replace(/[^0-9.]/g, "")); return Number.isFinite(n) && n > 0 ? n : undefined; };
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Company-written post text → safe article HTML (everything escaped; "## " lines become headings, "- " lines lists). */
export function textToArticleHtml(text: string): string {
  return text.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 1 && /^#{1,4}\s/.test(lines[0])) {
      const level = Math.min(Math.max(lines[0].match(/^#+/)![0].length, 2), 4);
      return `<h${level}>${escapeHtml(lines[0].replace(/^#+\s*/, ""))}</h${level}>`;
    }
    if (lines.every((line) => /^[-*]\s/.test(line))) return `<ul>${lines.map((line) => `<li>${escapeHtml(line.replace(/^[-*]\s*/, ""))}</li>`).join("")}</ul>`;
    return `<p>${lines.map(escapeHtml).join("<br />")}</p>`;
  }).join("");
}

const hoursNotes: [string, string][] = [["dailyHours", "Daily hours"], ["emergencyHours", "Emergency hours"], ["availability24x7", "24/7 availability"], ["holidayHours", "Holiday hours"], ["seasonalHours", "Seasonal hours"], ["specialClosures", "Special closures"]];

/** A directory card for a live company (from GET /companies/public). */
export function companyListingToPlumber(company: CompanyListing): Plumber {
  const established = company.established || (company.createdAt ? yearOf(company.createdAt) : new Date().getFullYear());
  return {
    id: company._id,
    providerType: "company",
    slug: company.slug,
    companyName: company.companyName,
    ownerName: company.ownerName || company.companyName,
    tagline: company.tagline,
    rating: company.rating || 0,
    reviewCount: company.reviewCount || 0,
    // Image components need a src, so companies without a logo get the default picture.
    logo: displayableImage(company.logo) || displayableImage(company.coverImage) || "/Plumber.png",
    services: company.services || [],
    priceRange: company.averageCost ? `Avg. $${company.averageCost}` : "Contact for pricing",
    averageCost: company.averageCost || 0,
    availability: openNowLabel(company.weeklyHours) ?? "Available",
    isVerified: Boolean(company.verified),
    isEmergency: Boolean(company.isEmergency),
    // "Austin, TX" like the demo plumbers; a street address is only used when there is no city.
    location: [company.city, company.state].filter(Boolean).join(", ") || company.location || "",
    city: company.city,
    state: company.state,
    phone: company.phone || "",
    email: company.email || "",
    website: company.website,
    description: company.description || company.tagline || "",
    yearsInBusiness: company.yearsInBusiness || 0,
    established,
    licenseNumber: company.licenseNumber,
    insurance: company.insurance || "",
    certifications: splitList(company.certifications),
    serviceAreas: company.serviceAreas || [],
    specializations: company.services || [],
    responseTime: company.responseTime || "Contact for availability",
    teamSize: company.teamSize || 0,
    warranty: company.warranty || "",
    paymentMethods: [],
    languages: splitList(company.languages),
    media: { images: displayableImage(company.coverImage) ? [displayableImage(company.coverImage)] : [], videos: [] },
    discount: company.offer?.discount || company.offer?.title,
    promoCode: company.offer?.promoCode,
    openingHours: company.weeklyHours?.length ? { weekly: company.weeklyHours, notes: [] } : undefined,
    coordinates: company.coordinates,
    blogCount: company.blogCount ?? 0,
    // Cards only get names and roles; the profile loads the full team.
    teamMembers: (company.teamPreview ?? []).map((member, index) => ({ id: `preview-${index}`, name: member.name, role: member.role || "Team member", specialties: [], experience: 0, certificates: [], availability: "", bio: "" })),
    projects: [],
  };
}

/** The full public profile of a live company, shaped like the built-in demo plumbers. */
export function companyProfileToPlumber(profile: CompanyProfile): Plumber {
  const offerings = profile.services ?? [];
  const card = companyListingToPlumber({ ...profile, services: offerings.map((service) => service.name) });
  const serviceNames = card.services;
  const about = profile.about ?? {};
  const contact = profile.contact ?? {};
  const prices = offerings.map((service) => service.price).filter(Boolean) as string[];
  const images = (profile.gallery ?? []).filter((item) => item.mediaKind !== "video").map((item) => displayableImage(item.media)).filter(Boolean);
  const videos = (profile.gallery ?? []).filter((item) => item.mediaKind === "video").map((item) => item.media);
  const cover = displayableImage(profile.header?.coverImage) || displayableImage(profile.coverImage);
  const weekly = profile.hours?.weeklyHours ?? [];
  const notes = hoursNotes.filter(([key]) => profile.hours?.[key]).map(([key, label]) => ({ label, value: String(profile.hours![key]) }));
  const openingHours: OpeningHours | undefined = weekly.length || notes.length ? { weekly, notes } : undefined;
  const now = new Date().getFullYear();

  const teamMembers: TeamMember[] = (profile.team ?? []).map((member) => ({
    id: member._id,
    name: member.name,
    role: member.role || "Team member",
    photo: displayableImage(member.photo) || undefined,
    specialties: member.specialties ?? [],
    experience: member.experienceYears ?? 0,
    careerStartYear: member.experienceYears ? now - member.experienceYears : undefined,
    joinedCompanyYear: member.joinedYear,
    certificates: member.certificates ?? [],
    licenseNumber: member.licenseNumber,
    availability: member.availability || "Available",
    bio: member.bio || "",
  }));

  const blogs: BlogPost[] = (profile.blogs ?? []).map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.excerpt,
    content: textToArticleHtml(post.content),
    image: displayableImage(post.coverImage) || cover || "/Plumber.png",
    video: null,
    author: post.author || card.companyName,
    date: (post.publishDate ?? "").slice(0, 10),
    readTime: Math.max(1, Math.round(post.content.split(/\s+/).length / 200)),
    readCount: 0,
    reactions: { like: 0, love: 0, helpful: 0 },
    comments: [],
  }));

  const reviews: PlumberReview[] = (profile.reviews ?? []).map((review) => ({ name: review.customer, rating: review.rating, text: review.review, date: review.createdAt.slice(0, 10), photo: displayableImage(review.photo) || undefined }));

  return {
    ...card,
    companyName: profile.header?.companyName || card.companyName,
    ownerName: profile.header?.ownerName || contact.contactPerson || card.ownerName,
    logo: displayableImage(profile.header?.logo) || card.logo,
    description: profile.description || about.longDescription || card.description,
    priceRange: prices.length ? [...new Set([prices[0], prices[prices.length - 1]])].join(" – ") : card.priceRange,
    isEmergency: card.isEmergency || Boolean(profile.booking?.emergencyBooking),
    specializations: offerings.filter((service) => service.featured).map((service) => service.name).concat(serviceNames).filter((name, index, all) => all.indexOf(name) === index),
    teamSize: card.teamSize || teamMembers.length,
    teamMembers,
    media: { images: images.length ? images : cover ? [cover] : [], videos },
    projects: (profile.projects ?? []).map((project) => ({
      id: project._id,
      title: project.title,
      client: project.client || "Private client",
      description: project.description,
      image: displayableImage(project.afterImage) || displayableImage(project.beforeImage) || cover || "/Plumber.png",
      year: yearOf(project.completedDate || project.createdAt),
      clientRating: project.rating,
      clientReview: project.testimonial,
      projectCost: numberFrom(project.budget),
      durationDays: numberFrom(project.duration),
      clientDetails: { name: project.client || "Private client", type: project.service, location: project.location || card.location, contactPerson: project.client || "" },
      projectDetails: { category: project.service, scope: project.results || project.description, challenge: project.challenge || "", solution: project.solution || "", materials: [], teamSize: 0, warranty: card.warranty, completedAt: project.completedDate ?? "" },
    })),
    blogs,
    faqs: profile.faqs?.map(({ question, answer }) => ({ question, answer })) ?? [],
    reviews,
    rating: card.rating,
    reviewCount: card.reviewCount,
    branches: (profile.branches ?? []).flatMap((branch) => {
      const lat = Number(branch.latitude), lng = Number(branch.longitude);
      return branch.latitude && branch.longitude && Number.isFinite(lat) && Number.isFinite(lng)
        ? [{ name: branch.label || branch.city || card.companyName, lat, lng, address: [branch.address, branch.city, branch.state].filter(Boolean).join(", ") }]
        : [];
    }),
    openingHours,
    availability: openNowLabel(weekly) ?? card.availability,
    blogCount: blogs.length,
    coordinates: card.coordinates,
    baseLocation: profile.serviceArea?.branchLocation || undefined,
    socialLinks: profile.socialLinks ?? {},
    serviceAreaDetails: profile.serviceArea?.areaDetails?.length
      ? profile.serviceArea.areaDetails.map((area) => ({ name: area.name, services: area.services ?? [] }))
      : card.serviceAreas.map((name) => ({ name, services: [] })),
    about: Object.fromEntries(["slogan", "longDescription", "missionStatement", "visionStatement", "companyHistory", "founderStory", "coreValues"].filter((key) => about[key]).map((key) => [key, about[key]])),
    keyHighlights: [about.slogan, card.isVerified ? "Verified company" : "", card.isEmergency ? "Emergency service available" : "", card.warranty].filter(Boolean) as string[],
  };
}

// ---- Freelancers (GET /freelancers/public and /freelancers/public/:id/profile) ----

export type FreelancerListing = {
  _id: string;
  displayName: string;
  headline?: string;
  photo?: string;
  coverImage?: string;
  phone?: string;
  city?: string;
  state?: string;
  hourlyRate?: number;
  yearsExperience?: number;
  services?: string[];
  serviceAreas?: string[];
  isAvailable?: boolean;
  createdAt?: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  licenseNumber?: string;
  insurance?: string;
  bio?: string;
  specialties?: string[];
  certifications?: string;
  languages?: string[];
  responseTime?: string;
  averageCost?: number;
  offer?: Offer;
  isEmergency?: boolean;
  weeklyHours?: OpeningHoursDay[];
  coordinates?: { lat: number; lng: number };
  baseLocation?: string;
  blogCount?: number;
};

export type FreelancerProfile = Omit<FreelancerListing, "services"> & Pick<CompanyProfile, "services" | "gallery" | "projects" | "reviews" | "faqs" | "blogs" | "offers" | "booking" | "hours" | "serviceArea" | "socialLinks">;

/** A freelancer in company terms, so cards and profile pages render it the same way (a team of one). */
function freelancerAsCompany(freelancer: Omit<FreelancerListing, "services">) {
  return {
    _id: freelancer._id,
    companyName: freelancer.displayName,
    ownerName: freelancer.displayName,
    tagline: freelancer.headline,
    logo: freelancer.photo,
    coverImage: freelancer.coverImage,
    serviceAreas: freelancer.serviceAreas,
    location: [freelancer.city, freelancer.state].filter(Boolean).join(", ") || freelancer.baseLocation,
    city: freelancer.city,
    state: freelancer.state,
    phone: freelancer.phone,
    description: freelancer.bio || freelancer.headline,
    rating: freelancer.rating,
    reviewCount: freelancer.reviewCount,
    createdAt: freelancer.createdAt,
    verified: freelancer.verified,
    yearsInBusiness: freelancer.yearsExperience,
    established: freelancer.yearsExperience ? new Date().getFullYear() - freelancer.yearsExperience : undefined,
    teamSize: 1,
    licenseNumber: freelancer.licenseNumber,
    insurance: freelancer.insurance,
    certifications: freelancer.certifications,
    responseTime: freelancer.responseTime,
    averageCost: freelancer.averageCost,
    languages: freelancer.languages?.join(", "),
    offer: freelancer.offer,
    isEmergency: freelancer.isEmergency,
    weeklyHours: freelancer.weeklyHours,
    coordinates: freelancer.coordinates,
    blogCount: freelancer.blogCount,
  };
}

function freelancerExtras(freelancer: Omit<FreelancerListing, "services">, plumber: Plumber): Plumber {
  const specialties = freelancer.specialties ?? [];
  return {
    ...plumber,
    providerType: "freelancer",
    teamSize: 1,
    hourlyRate: freelancer.hourlyRate,
    priceRange: freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : plumber.priceRange,
    specializations: [...new Set([...specialties, ...plumber.specializations])],
    availability: freelancer.isAvailable === false ? "Not taking new jobs" : plumber.availability,
    keyHighlights: [freelancer.headline, plumber.isVerified ? "Verified freelancer" : "", plumber.isEmergency ? "Emergency service available" : ""].filter(Boolean) as string[],
  };
}

/** A directory card for a live freelancer. */
export function freelancerListingToPlumber(freelancer: FreelancerListing): Plumber {
  return freelancerExtras(freelancer, companyListingToPlumber({ ...freelancerAsCompany(freelancer), services: freelancer.services }));
}

/** A live freelancer's full public profile, shaped like the demo plumbers (no team section). */
export function freelancerProfileToPlumber(profile: FreelancerProfile): Plumber {
  const plumber = companyProfileToPlumber({ ...freelancerAsCompany(profile), services: profile.services, gallery: profile.gallery, projects: profile.projects, reviews: profile.reviews, faqs: profile.faqs, blogs: profile.blogs, offers: profile.offers, booking: profile.booking, hours: profile.hours, serviceArea: profile.serviceArea, socialLinks: profile.socialLinks, team: [] });
  return { ...freelancerExtras(profile, plumber), teamMembers: [], about: profile.bio ? { longDescription: profile.bio } : {} };
}

/** A plumber's public profile URL: /company/<slug> for live companies, /plumber/<id> otherwise. */
export function plumberHref(plumber: Pick<Plumber, "id" | "slug" | "providerType">): string {
  return plumber.providerType === "company" && plumber.slug ? `/company/${plumber.slug}` : `/plumber/${plumber.id}`;
}

const isListingId = (id: string) => /^[a-f0-9]{24}$/i.test(id);

async function getData<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return ((await response.json()).data ?? null) as T | null;
  } catch {
    return null;
  }
}

/** Every published live company and freelancer, as directory cards (newest first within each). */
export async function fetchPublishedPlumbers(): Promise<Plumber[]> {
  const [companies, freelancers] = await Promise.all([getData<CompanyListing[]>("/companies/public"), getData<FreelancerListing[]>("/freelancers/public")]);
  return [...(companies ?? []).map(companyListingToPlumber), ...(freelancers ?? []).map(freelancerListingToPlumber)];
}

/** One live company's (by id or slug) or freelancer's (by id) full profile, or null if not published. */
export async function fetchLiveProfile(id: string): Promise<Plumber | null> {
  const key = decodeURIComponent(id).toLowerCase();
  // Companies are found by listing id or URL slug; freelancers by listing id.
  if (!isListingId(key) && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) return null;
  const company = await getData<CompanyProfile>(`/companies/public/${encodeURIComponent(key)}/profile`);
  if (company) return companyProfileToPlumber(company);
  if (!isListingId(key)) return null;
  const freelancer = await getData<FreelancerProfile>(`/freelancers/public/${id}/profile`);
  return freelancer ? freelancerProfileToPlumber(freelancer) : null;
}

// ---- Site-wide blog feed (GET /blogs) ----

type PublicBlogPost = { id: string; slug: string; title: string; category?: string; excerpt: string; coverImage?: string; author?: string; publishDate?: string; tags?: string[]; readTime: number; provider: { type: "company" | "freelancer"; id: string; slug?: string; name: string; rating: number } };
export type BlogFeedEntry = { plumberId: string; href: string; companyName: string; companyRating: number; post: BlogPost };

/** Published posts from live companies and freelancers, shaped for the blog pages (newest first). */
export async function fetchPublicBlogFeed(): Promise<BlogFeedEntry[]> {
  const posts = (await getData<PublicBlogPost[]>("/blogs")) ?? [];
  return posts.map((post) => ({
    plumberId: post.provider.id,
    href: plumberHref({ id: post.provider.id, slug: post.provider.slug, providerType: post.provider.type }),
    companyName: post.provider.name,
    companyRating: post.provider.rating,
    post: { slug: post.slug, title: post.title, summary: post.excerpt, content: [post.category, ...(post.tags ?? [])].filter(Boolean).join(" "), image: displayableImage(post.coverImage) || "/Plumber.png", video: null, author: post.author || post.provider.name, date: (post.publishDate ?? "").slice(0, 10), readTime: post.readTime, readCount: 0, reactions: { like: 0, love: 0, helpful: 0 }, comments: [] },
  }));
}
