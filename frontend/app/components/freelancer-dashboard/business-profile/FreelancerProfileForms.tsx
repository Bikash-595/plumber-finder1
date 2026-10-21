// Freelancer profile sections, saved to /api/freelancers/<section>.
// They reuse the company business-profile form components; draft keys are prefixed so
// freelancer drafts never mix with company drafts on the same device.
import CollectionForm from "@/components/company-dashboard/business-profile/CollectionForm";
import CompanyBlogForm from "@/components/company-dashboard/business-profile/CompanyBlogForm";
import PreviousProjectForm from "@/components/company-dashboard/business-profile/PreviousProjectForm";
import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";

const headerDefaults = { photo: "", coverImage: "", displayName: "", headline: "", yearsExperience: "", licenseNumber: "", insurance: "", hourlyRate: "", phone: "", city: "", state: "", isAvailable: true, published: true };
const overviewDefaults = { bio: "", specialties: "", certifications: "", languages: "", responseTime: "", jobsCompleted: "", averageCost: "", emergencyAvailable: false };
const serviceAreaDefaults = { areasCovered: "", radius: "", branchLocation: "" };
const bookingDefaults = { instantBooking: true, approvalRequired: false, emergencyBooking: false, workingDays: "", timeSlots: "", cancellationPolicy: "" };

export function FreelancerHeaderProfileForm() {
  return <SectionForm section="freelancer-header-profile" apiEndpoint="/freelancers/header-profile" title="Your Profile" description="Your name, trade, and photo appear at the top of your public profile. Saving this registers you in the public freelancer directory." defaults={headerDefaults} fields={[
    { name: "photo", label: "Profile Photo", type: "image" },
    { name: "coverImage", label: "Cover Image", type: "image" },
    { name: "displayName", label: "Display Name", placeholder: "e.g. Dana Pipes" },
    { name: "headline", label: "Trade / Headline", placeholder: "e.g. Licensed Master Plumber" },
    { name: "yearsExperience", label: "Years of Experience", type: "number" },
    { name: "hourlyRate", label: "Hourly Rate (USD)", type: "number" },
    { name: "licenseNumber", label: "License Number" },
    { name: "insurance", label: "Insurance" },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
    { name: "isAvailable", label: "Available for new jobs", type: "checkbox" },
    { name: "published", label: "Show me in the public directory", type: "checkbox" },
  ]} />;
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

export function FreelancerServicesForm() {
  return <CollectionForm section="freelancer-services" apiEndpoint="/freelancers/services" title="Services Offered" description="List the services you offer. They decide which service pages you appear on." itemName="Service" fields={[{ name: "name", label: "Service Name" }, { name: "description", label: "Description", type: "textarea" }, { name: "price", label: "Price" }, { name: "duration", label: "Duration" }, { name: "emergency", label: "Emergency Service", type: "checkbox" }, { name: "featured", label: "Featured", type: "checkbox" }, { name: "image", label: "Service Image", type: "image" }]} />;
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
  return <SectionForm section="freelancer-service-areas" apiEndpoint="/freelancers/service-areas" title="Service Areas" description="The cities and radius you cover." defaults={serviceAreaDefaults} fields={[{ name: "areasCovered", label: "Areas Covered", type: "textarea", placeholder: "Austin, Round Rock, Cedar Park" }, { name: "radius", label: "Service Radius (miles)", type: "number" }, { name: "branchLocation", label: "Home Base" }]} />;
}

export function FreelancerBlogsForm() {
  return <CompanyBlogForm apiEndpoint="/freelancers/blogs" draftKey="freelancer-blogs" startEmpty />;
}

export function FreelancerBookingForm() {
  return <SectionForm section="freelancer-booking" apiEndpoint="/freelancers/booking" title="Booking Settings" description="Control how customers can request appointments with you." defaults={bookingDefaults} fields={[{ name: "instantBooking", label: "Instant Booking", type: "checkbox" }, { name: "approvalRequired", label: "Approval Required", type: "checkbox" }, { name: "emergencyBooking", label: "Emergency Booking", type: "checkbox" }, { name: "workingDays", label: "Working Days" }, { name: "timeSlots", label: "Time Slots" }, { name: "cancellationPolicy", label: "Cancellation Policy", type: "textarea" }]} />;
}

export function FreelancerOffersForm() {
  return <CollectionForm section="freelancer-offers" apiEndpoint="/freelancers/special-offers" title="Special Offers" description="Promotions customers can claim." itemName="Offer" fields={[{ name: "title", label: "Offer Title" }, { name: "description", label: "Description", type: "textarea" }, { name: "discount", label: "Discount" }, { name: "promoCode", label: "Promo Code" }, { name: "startDate", label: "Start Date", type: "date" }, { name: "endDate", label: "End Date", type: "date" }, { name: "image", label: "Offer Image", type: "image" }]} />;
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
  { slug: "offers", label: "Special Offers", Form: FreelancerOffersForm },
];
