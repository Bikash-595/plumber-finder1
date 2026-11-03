import mongoose from "mongoose";
import { CustomerReview } from "../../../reviews/models/index.js";
import { FreelancerBlog } from "../../blogs/models/FreelancerBlog.js";
import { FreelancerContact } from "../../contact/models/FreelancerContact.js";
import { FreelancerFaq } from "../../faqs/models/FreelancerFaq.js";
import { FreelancerGalleryItem } from "../../gallery/models/FreelancerGalleryItem.js";
import { FreelancerHeaderProfile } from "../../header-profile/models/FreelancerHeaderProfile.js";
import { FreelancerListing } from "../../listing/models/FreelancerListing.js";
import { FreelancerOpeningHours } from "../../opening-hours/models/FreelancerOpeningHours.js";
import { FreelancerOverview } from "../../overview/models/FreelancerOverview.js";
import { FreelancerProject } from "../../previous-projects/models/FreelancerProject.js";
import { FreelancerServiceArea } from "../../service-areas/models/FreelancerServiceArea.js";
import { FreelancerServiceOffering } from "../../services/models/FreelancerServiceOffering.js";
import { FreelancerSocialLinks } from "../../social-links/models/FreelancerSocialLinks.js";
import { FreelancerSpecialOffer } from "../../special-offers/models/FreelancerSpecialOffer.js";

// How complete a freelancer's public profile is, as a weighted checklist (weights add up to 100), with what's
// missing and a link to the editor. Same idea as the company checklist, using the freelancer's own sections.
const editor = (slug) => `/freelancer/business-profile/${slug}`;
const hasText = (value, min = 1) => typeof value === "string" && value.trim().length >= min;

export async function profileStrength(freelancerId) {
  const freelancer = new mongoose.Types.ObjectId(String(freelancerId));
  const own = { freelancer };
  const [listing, header, overview, contact, hours, social, services, areas, photos, projects, faqs, offers, blogs, reviews] = await Promise.all([
    FreelancerListing.findOne(own).select("phone city").lean(),
    FreelancerHeaderProfile.findOne(own).select("photo coverImage coverImages headline bio licenseNumber insurance").lean(),
    FreelancerOverview.findOne(own).select("specialties certifications").lean(),
    FreelancerContact.findOne(own).select("primaryPhone email website whatsapp").lean(),
    FreelancerOpeningHours.exists(own),
    FreelancerSocialLinks.findOne(own).lean(),
    FreelancerServiceOffering.countDocuments(own),
    FreelancerServiceArea.countDocuments(own),
    FreelancerGalleryItem.countDocuments(own),
    FreelancerProject.countDocuments(own),
    FreelancerFaq.countDocuments(own),
    FreelancerSpecialOffer.countDocuments(own),
    FreelancerBlog.countDocuments({ ...own, status: "published" }),
    CustomerReview.countDocuments({ providerType: "freelancer", providerAccount: freelancer, status: "published" }),
  ]);
  const socialCount = social ? Object.entries(social).filter(([key, value]) => !["_id", "freelancer", "createdAt", "updatedAt", "__v"].includes(key) && hasText(value, 8)).length : 0;
  const ways = [contact?.primaryPhone || listing?.phone, contact?.email, contact?.website, contact?.whatsapp].filter((value) => hasText(value)).length;

  const items = [
    { key: "photo", group: "Brand", label: "Profile photo", weight: 10, done: hasText(header?.photo), tip: "Customers like to see who's coming to their home.", href: editor("header-profile") },
    { key: "cover", group: "Brand", label: "Cover photo", weight: 5, done: hasText(header?.coverImage) || Boolean(header?.coverImages?.length), tip: "A photo of you at work or your van.", href: editor("header-profile") },
    { key: "bio", group: "Brand", label: "Headline and bio", weight: 9, done: hasText(header?.headline) && hasText(header?.bio, 60), tip: "Your trade in a few words and at least 60 characters about you.", href: editor("header-profile") },
    { key: "contact", group: "Trust", label: "Two ways to reach you", weight: 6, done: ways >= 2, progress: `${Math.min(ways, 2)} of 2`, tip: "Phone plus email, WhatsApp or a website.", href: editor("contact") },
    { key: "credentials", group: "Trust", label: "Licence and insurance", weight: 12, done: hasText(header?.licenseNumber) && hasText(header?.insurance), tip: "Licensed and insured plumbers are booked more often.", href: editor("header-profile") },
    { key: "specialties", group: "Trust", label: "Specialties", weight: 4, done: Boolean(overview?.specialties?.length), tip: "What you're best at, e.g. water heaters or leak detection.", href: editor("overview") },
    { key: "services", group: "Services", label: "At least 3 services", weight: 12, done: services >= 3, progress: `${Math.min(services, 3)} of 3`, tip: "List what you do, with prices where you can.", href: editor("services") },
    { key: "areas", group: "Services", label: "Service areas", weight: 8, done: areas >= 1, progress: `${areas} added`, tip: "Show up in searches for the places you cover.", href: editor("service-areas") },
    { key: "hours", group: "Services", label: "Opening hours", weight: 6, done: Boolean(hours), tip: "Let customers know when you work.", href: editor("opening-hours") },
    { key: "photos", group: "Proof of work", label: "At least 4 photos", weight: 10, done: photos >= 4, progress: `${Math.min(photos, 4)} of 4`, tip: "Real photos of finished jobs build confidence.", href: editor("gallery") },
    { key: "projects", group: "Proof of work", label: "A previous project", weight: 6, done: projects >= 1, tip: "Describe a job from start to finish.", href: editor("projects") },
    { key: "faqs", group: "Answers", label: "At least 3 FAQs", weight: 4, done: faqs >= 3, progress: `${Math.min(faqs, 3)} of 3`, tip: "Answer the questions customers ask most.", href: editor("faqs") },
    { key: "social", group: "Answers", label: "Social links", weight: 3, done: socialCount >= 1, tip: "Link your Facebook, Instagram or other pages.", href: editor("social-links") },
    { key: "offers", group: "Growth", label: "A special offer", weight: 2, done: offers >= 1, tip: "A discount helps first-time customers choose you.", href: editor("offers") },
    { key: "reviews", group: "Growth", label: "Your first review", weight: 3, done: reviews >= 1, tip: "Completed bookings ask customers for a review automatically.", href: editor("reviews") },
  ];
  const percent = items.reduce((sum, item) => sum + (item.done ? item.weight : 0), 0);
  const level = percent >= 90 ? "Excellent" : percent >= 70 ? "Strong" : percent >= 40 ? "Getting there" : "Just started";
  const next = items.filter((item) => !item.done).sort((a, b) => b.weight - a.weight).slice(0, 3).map((item) => item.key);
  return { percent, level, items, next, extras: { blogs, services, photos, reviews } };
}
