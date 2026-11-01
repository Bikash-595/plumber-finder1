import mongoose from "mongoose";
import { CustomerReview, GoogleBusinessLink } from "../../../reviews/models/index.js";
import { CompanyBlog } from "../../blogs/models/CompanyBlog.js";
import { CompanyOverview } from "../../company-overview/models/CompanyOverview.js";
import { CompanyFaq } from "../../faqs/models/CompanyFaq.js";
import { CompanyGalleryItem } from "../../gallery/models/CompanyGalleryItem.js";
import { CompanyHeaderProfile } from "../../header-profile/models/CompanyHeaderProfile.js";
import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { CompanyOpeningHours } from "../../opening-hours/models/CompanyOpeningHours.js";
import { CompanyProject } from "../../previous-projects/models/CompanyProject.js";
import { CompanyServiceArea } from "../../service-areas/models/CompanyServiceArea.js";
import { CompanyServiceOffering } from "../../services/models/CompanyServiceOffering.js";
import { CompanySocialLinks } from "../../social-links/models/CompanySocialLinks.js";
import { CompanySpecialOffer } from "../../special-offers/models/CompanySpecialOffer.js";
import { CompanyTeamMember } from "../../team/models/CompanyTeamMember.js";

// How complete a company's public profile is, as a weighted checklist (weights add up to 100). Each item says
// what's missing and links to the editor. Complete profiles get more views and bookings, so this drives the
// "Profile strength" score on the dashboard and the Company Profile page.
const editor = (slug) => `/company-dashboard/business-profile/${slug}`;
const hasText = (value, min = 1) => typeof value === "string" && value.trim().length >= min;

export async function profileStrength(companyId) {
  const company = new mongoose.Types.ObjectId(String(companyId));
  const own = { company };
  const [listing, header, overview, hours, social, services, areas, photos, projects, team, faqs, offers, blogs, reviews, google] = await Promise.all([
    CompanyListing.findOne(own).select("phone email website location city").lean(),
    CompanyHeaderProfile.findOne(own).select("logo coverImage coverImages tagline bio licenseNumber insurance").lean(),
    CompanyOverview.findOne(own).lean(),
    CompanyOpeningHours.exists(own),
    CompanySocialLinks.findOne(own).lean(),
    CompanyServiceOffering.countDocuments(own),
    CompanyServiceArea.countDocuments(own),
    CompanyGalleryItem.countDocuments(own),
    CompanyProject.countDocuments(own),
    CompanyTeamMember.countDocuments(own),
    CompanyFaq.countDocuments(own),
    CompanySpecialOffer.countDocuments(own),
    CompanyBlog.countDocuments({ ...own, status: "published" }),
    CustomerReview.countDocuments({ providerType: "company", providerAccount: company, status: "published" }),
    GoogleBusinessLink.exists({ providerType: "company", providerAccount: company, connectionStatus: "connected" }),
  ]);
  const socialCount = social ? Object.entries(social).filter(([key, value]) => !["_id", "company", "createdAt", "updatedAt", "__v"].includes(key) && hasText(value, 8)).length : 0;
  const contact = [listing?.phone, listing?.email, listing?.website].filter((value) => hasText(value)).length;

  const items = [
    { key: "logo", group: "Brand", label: "Logo", weight: 8, done: hasText(header?.logo), tip: "Customers trust a recognisable logo.", href: editor("header-profile") },
    { key: "cover", group: "Brand", label: "Cover photo", weight: 6, done: hasText(header?.coverImage) || Boolean(header?.coverImages?.length), tip: "A photo of your team or van at the top of your profile.", href: editor("header-profile") },
    { key: "bio", group: "Brand", label: "Tagline and bio", weight: 8, done: hasText(header?.tagline) && hasText(header?.bio, 60), tip: "A short tagline and at least 60 characters about your business.", href: editor("header-profile") },
    { key: "contact", group: "Trust", label: "Phone, email and website", weight: 6, done: contact >= 2, progress: `${contact} of 3`, tip: "At least two ways to reach you.", href: editor("contact") },
    { key: "credentials", group: "Trust", label: "Licence and insurance", weight: 10, done: hasText(overview?.licenseNumber ?? header?.licenseNumber) && hasText(overview?.insurance ?? header?.insurance), tip: "Licensed and insured plumbers are booked more often.", href: editor("company-overview") },
    { key: "services", group: "Services", label: "At least 3 services", weight: 12, done: services >= 3, progress: `${Math.min(services, 3)} of 3`, tip: "List what you do, with prices where you can.", href: editor("services") },
    { key: "areas", group: "Services", label: "Service areas", weight: 8, done: areas >= 1, progress: `${areas} added`, tip: "Show up in searches for the places you cover.", href: editor("service-areas") },
    { key: "hours", group: "Services", label: "Business hours", weight: 6, done: Boolean(hours), tip: "Let customers know when you're open.", href: editor("business-hours") },
    { key: "photos", group: "Proof of work", label: "At least 4 photos", weight: 10, done: photos >= 4, progress: `${Math.min(photos, 4)} of 4`, tip: "Real photos of finished jobs build confidence.", href: editor("media") },
    { key: "projects", group: "Proof of work", label: "A previous project", weight: 6, done: projects >= 1, tip: "Describe a job from start to finish.", href: editor("projects") },
    { key: "team", group: "Proof of work", label: "Your team", weight: 4, done: team >= 1, tip: "Faces behind the business.", href: editor("team") },
    { key: "faqs", group: "Answers", label: "At least 3 FAQs", weight: 4, done: faqs >= 3, progress: `${Math.min(faqs, 3)} of 3`, tip: "Answer the questions customers ask most.", href: editor("faqs") },
    { key: "social", group: "Answers", label: "Social links", weight: 3, done: socialCount >= 1, tip: "Link your Facebook, Instagram or other pages.", href: editor("social-links") },
    { key: "offers", group: "Growth", label: "A special offer", weight: 2, done: offers >= 1, tip: "A discount or coupon helps first-time customers choose you.", href: editor("offers") },
    { key: "google", group: "Growth", label: "Google reviews connected", weight: 4, done: Boolean(google), tip: "Show your Google rating beside your PlumberFinder reviews.", href: editor("reviews") },
    { key: "reviews", group: "Growth", label: "Your first review", weight: 3, done: reviews >= 1, tip: "Ask happy customers to review you — completed bookings ask them automatically.", href: editor("reviews") },
  ];
  const percent = items.reduce((sum, item) => sum + (item.done ? item.weight : 0), 0);
  const level = percent >= 90 ? "Excellent" : percent >= 70 ? "Strong" : percent >= 40 ? "Getting there" : "Just started";
  const next = items.filter((item) => !item.done).sort((a, b) => b.weight - a.weight).slice(0, 3).map((item) => item.key);
  return { percent, level, items, next, extras: { blogs, services, photos, reviews } };
}
