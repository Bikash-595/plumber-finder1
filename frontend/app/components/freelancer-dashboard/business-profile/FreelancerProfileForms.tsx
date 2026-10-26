// Freelancer profile sections, saved to /api/freelancers/<section>.
// They reuse the company business-profile form components; draft keys are prefixed so
// freelancer drafts never mix with company drafts on the same device.
import ServicesEditor from "@/components/company-dashboard/business-profile/ServicesEditor";
import SpecialOffersEditor from "@/components/company-dashboard/business-profile/SpecialOffersEditor";
import CollectionForm from "@/components/company-dashboard/business-profile/CollectionForm";
import CompanyBlogForm from "@/components/company-dashboard/business-profile/CompanyBlogForm";
import PreviousProjectForm from "@/components/company-dashboard/business-profile/PreviousProjectForm";
import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import { socialExamples, socialFields } from "@/components/company-dashboard/business-profile/forms/BusinessProfileForms";
import ServiceAreasEditor from "@/components/company-dashboard/business-profile/ServiceAreasForm";
import FreelancerDeleteListing from "./FreelancerDeleteListing";
import FreelancerOpeningHoursForm from "./FreelancerOpeningHoursForm";

const headerDefaults = { photo: "", coverImages: "", displayName: "", headline: "", bio: "", yearsExperience: "", licenseNumber: "", insurance: "", hourlyRate: "", phone: "", city: "", state: "", isAvailable: true, published: true };
const overviewDefaults = { bio: "", specialties: "", certifications: "", languages: "", responseTime: "", jobsCompleted: "", averageCost: "", emergencyAvailable: false };
const bookingDefaults = { instantBooking: true, approvalRequired: false, emergencyBooking: false, workingDays: "", timeSlots: "", cancellationPolicy: "" };

export function FreelancerHeaderProfileForm() {
  return <><SectionForm section="freelancer-header-profile" apiEndpoint="/freelancers/header-profile" title="Your Profile" description="Your name, trade, short bio, and photo appear at the top of your public profile. Saving this registers you in the public freelancer directory." defaults={headerDefaults} fields={[
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
  ]} /><FreelancerDeleteListing /></>;
}

export function FreelancerOverviewForm() {
  return <SectionForm section="freelancer-overview" apiEndpoint="/freelancers/overview" title="Overview" description="Tell customers about your experience and what you specialise in." defaults={overviewDefaults} fields={[
    { name: "bio", label: "About You", type: "textarea" },
    { name: "specialties", label: "Specialties", placeholder: "Leak repair, water heaters, drains" },
    { name: "languages", label: "Languages", placeholder: "English, Spanish" },
    { name: "certifications", label: "Certifications", placeholder: "Separate with commas" },
    { name: "responseTime", label: "Typical Response Time", placeholder: "Within 2 hours" },
    { name: "jobsCompleted", label: "Jobs Completed", type: "number" },
    { name: "averageCost", label: "Average Job Cost (USD)", type: "number" },
    { name: "emergencyAvailable", label: "Available for emergencies", type: "checkbox" },
  ]} />;
}

/** Services with category, price, duration, and what's included (saved to /api/freelancers/services). */
export function FreelancerServicesForm() {
  return <ServicesEditor apiEndpoint="/freelancers/services" />;
}

export function FreelancerGalleryForm() {
  return <CollectionForm section="freelancer-gallery" apiEndpoint="/freelancers/gallery" title="Work Gallery" description="Add photos or videos of your work." itemName="Media item" fields={[{ name: "type", label: "Media type" }, { name: "media", label: "Image or Video", type: "media" }, { name: "caption", label: "Caption", type: "textarea" }]} />;
}

export function FreelancerProjectsForm() {
  return <PreviousProjectForm apiEndpoint="/freelancers/previous-projects" draftKey="freelancer-projects" startEmpty />;
}

export function FreelancerReviewsForm() {
  return <CollectionForm section="freelancer-reviews" apiEndpoint="/freelancers/reviews" title="Customer Reviews" description="Show reviews from customers you have worked with." itemName="Review" fields={[{ name: "customer", label: "Customer Name" }, { name: "rating", label: "Rating (1–5)", type: "number" }, { name: "review", label: "Review", type: "textarea" }, { name: "photo", label: "Customer Photo", type: "image" }]} />;
}

export function FreelancerFaqsForm() {
  return <CollectionForm section="freelancer-faqs" apiEndpoint="/freelancers/faqs" title="Frequently Asked Questions" description="Answer common questions before customers need to ask." itemName="Question" fields={[{ name: "question", label: "Question" }, { name: "answer", label: "Answer", type: "textarea" }]} />;
}

export function FreelancerServiceAreasForm() {
  return <ServiceAreasEditor apiEndpoint="/freelancers/service-areas" servicesEndpoint="/freelancers/services" />;
}

export function FreelancerBlogsForm() {
  return <CompanyBlogForm apiEndpoint="/freelancers/blogs" draftKey="freelancer-blogs" startEmpty />;
}

export function FreelancerBookingForm() {
  return <SectionForm section="freelancer-booking" apiEndpoint="/freelancers/booking" title="Booking Settings" description="Control how customers can request appointments with you." defaults={bookingDefaults} fields={[{ name: "instantBooking", label: "Instant Booking", type: "checkbox" }, { name: "approvalRequired", label: "Approval Required", type: "checkbox" }, { name: "emergencyBooking", label: "Emergency Booking", type: "checkbox" }, { name: "workingDays", label: "Working Days" }, { name: "timeSlots", label: "Time Slots" }, { name: "cancellationPolicy", label: "Cancellation Policy", type: "textarea" }]} />;
}

/** Offers with several coupon codes, each with its own discount (saved to /api/freelancers/special-offers). */
export function FreelancerOffersForm() {
  return <SpecialOffersEditor apiEndpoint="/freelancers/special-offers" servicesEndpoint="/freelancers/services" />;
}

export function FreelancerSocialLinksForm() {
  return <SectionForm section="freelancer-social-links" apiEndpoint="/freelancers/social-links" title="Social Links" description="Add your social media pages. They appear as icons on your public profile." defaults={socialExamples} fields={socialFields} />;
}

/** Slug → page title and form, used by the menu, overview cards, and the [section] route. */
export const freelancerProfileSections = [
  { slug: "header-profile", label: "Your Profile", Form: FreelancerHeaderProfileForm },
  { slug: "overview", label: "Overview", Form: FreelancerOverviewForm },
  { slug: "services", label: "Services", Form: FreelancerServicesForm },
  { slug: "gallery", label: "Work Gallery", Form: FreelancerGalleryForm },
  { slug: "projects", label: "Previous Projects", Form: FreelancerProjectsForm },
  { slug: "reviews", label: "Reviews", Form: FreelancerReviewsForm },
  { slug: "faqs", label: "FAQs", Form: FreelancerFaqsForm },
  { slug: "service-areas", label: "Service Areas", Form: FreelancerServiceAreasForm },
  { slug: "blogs", label: "Blogs", Form: FreelancerBlogsForm },
  { slug: "booking", label: "Booking", Form: FreelancerBookingForm },
  { slug: "opening-hours", label: "Opening Hours", Form: FreelancerOpeningHoursForm },
  { slug: "social-links", label: "Social Links", Form: FreelancerSocialLinksForm },
  { slug: "offers", label: "Special Offers", Form: FreelancerOffersForm },
];
