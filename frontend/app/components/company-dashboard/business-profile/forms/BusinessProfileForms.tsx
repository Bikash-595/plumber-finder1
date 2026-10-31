import CollectionForm from "../CollectionForm";
import ProviderReviews from "@/components/reviews/ProviderReviews";
import ServicesEditor from "../ServicesEditor";
import OpeningHoursForm from "../OpeningHoursForm";
import SectionForm from "../SectionForm";
import SpecialOffersEditor from "../SpecialOffersEditor";
import ServiceAreasEditor from "../ServiceAreasForm";
import { companyProfileSeed } from "../profileStore";

// Social media fields shared with the freelancer dashboard (full links, e.g. https://facebook.com/yourpage).
export const socialFields = [{ name: "facebook", label: "Facebook", type: "url" as const }, { name: "instagram", label: "Instagram", type: "url" as const }, { name: "twitter", label: "X (Twitter)", type: "url" as const }, { name: "linkedin", label: "LinkedIn", type: "url" as const }, { name: "youtube", label: "YouTube", type: "url" as const }, { name: "tiktok", label: "TikTok", type: "url" as const }];
export const socialExamples = { facebook: "https://facebook.com/yourcompany", instagram: "https://instagram.com/yourcompany", twitter: "https://x.com/yourcompany", linkedin: "https://linkedin.com/company/yourcompany", youtube: "https://youtube.com/@yourcompany", tiktok: "https://tiktok.com/@yourcompany" };

export function BookingSettingsForm() {
  return <SectionForm section="booking" apiEndpoint="/companies/booking" title="Booking Settings" description="Control availability and how customers can request an appointment." defaults={{ instantBooking: true, approvalRequired: false, workingDays: "Monday–Saturday", timeSlots: "8:00 AM–6:00 PM", emergencyBooking: true, cancellationPolicy: "Please cancel at least 24 hours before your appointment." }} fields={[{ name: "instantBooking", label: "Instant Booking", type: "checkbox" }, { name: "approvalRequired", label: "Approval Required", type: "checkbox" }, { name: "workingDays", label: "Working Days" }, { name: "timeSlots", label: "Time Slots" }, { name: "emergencyBooking", label: "Emergency Booking", type: "checkbox" }, { name: "cancellationPolicy", label: "Cancellation Policy", type: "textarea" }]} />;
}

export function BranchesForm() {
  return <CollectionForm section="branches" title="Branches" description="Support multiple locations with their own service coverage and working hours." itemName="Branch" initial={{ name: "Uptown", manager: "Chris Bennett", address: "500 Main St, Dallas, TX 75201", phone: "(214) 555-6677", email: "service@dallasrapidplumbers.com", mapLocation: "32.7767, -96.7970", latitude: "32.7767", longitude: "-96.7970", services: "Emergency Service, Sewer Line", hours: "Mon–Sat 8 AM–6 PM" }} fields={[{ name: "name", label: "Branch Name" }, { name: "manager", label: "Manager" }, { name: "address", label: "Address", type: "textarea" }, { name: "phone", label: "Phone", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "mapLocation", label: "Google Map Location" }, { name: "latitude", label: "Latitude" }, { name: "longitude", label: "Longitude" }, { name: "services", label: "Services Available" }, { name: "hours", label: "Working Hours" }]} />;
}

/** Weekly opening days and times, saved to /api/companies/opening-hours and shown on the public profile. */
export function BusinessHoursForm() {
  return <OpeningHoursForm apiEndpoint="/companies/opening-hours" wizardFallback />;
}

export function CompanyOverviewForm() {
  return <SectionForm section="company-overview" title="Company Overview" description="Tell customers what your company does and why they should choose you." defaults={companyProfileSeed} fields={[{ name: "shortDescription", label: "Short Description", type: "textarea" }, { name: "fullDescription", label: "Full Description", type: "textarea" }, { name: "mission", label: "Mission", type: "textarea" }, { name: "vision", label: "Vision", type: "textarea" }, { name: "whyChooseUs", label: "Why Choose Us", type: "textarea" }]} />;
}

export function ContactInformationForm() {
  return <SectionForm section="contact" title="Contact Information" description="Keep customer-facing contact channels accurate." defaults={companyProfileSeed} fields={[{ name: "phone", label: "Phone", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "website", label: "Website", type: "url" }, { name: "whatsapp", label: "WhatsApp", type: "tel" }]} />;
}

export function FaqsForm() {
  return <CollectionForm section="faqs" apiEndpoint="/companies/faqs" title="Frequently Asked Questions" description="Answer booking questions before customers need to ask them." itemName="Question" initial={{ question: "Do you offer emergency service?", answer: "Yes, our team handles urgent plumbing calls." }} fields={[{ name: "question", label: "Question", required: true }, { name: "answer", label: "Answer", type: "textarea", required: true }]} />;
}

export function HeaderProfileForm() {
  return <SectionForm section="header-profile" apiEndpoint="/companies/header-profile" title="Company Profile" description="Your company name, tagline, short bio, logo, and credentials at the top of your public profile. Saving this creates your public page at /company/your-company-name." defaults={companyProfileSeed} fields={[{ name: "logo", label: "Company Logo", type: "image" }, { name: "coverImages", label: "Cover Photos", type: "images", maxImages: 8, legacyField: "coverImage", placeholder: "Add up to 8 wide photos (vans, team, finished jobs). They change automatically at the top of your profile; the first one is the main cover." }, { name: "companyName", label: "Company Name", required: true }, { name: "tagline", label: "Tagline", placeholder: "e.g. Fast, honest plumbing across Dallas since 2015" }, { name: "bio", label: "Short Bio (up to 600 characters, shown at the top of your profile and on your card)", type: "textarea", placeholder: "e.g. Family-owned plumbing company serving Dallas for over 10 years. We specialise in leak repair, water heaters and 24/7 emergency call-outs, with upfront pricing and licensed plumbers on every job." }, { name: "ownerName", label: "Owner Name" }, { name: "companyType", label: "Company Type" }, { name: "yearsInBusiness", label: "Years in Business", type: "number" }, { name: "licenseNumber", label: "License Number" }, { name: "insurance", label: "Insurance" }, { name: "certifications", label: "Certifications" }]} />;
}

export function MapsForm() {
  return <SectionForm section="maps" title="Google Maps" description="Enter your map coordinates and booking radius." defaults={{ address: "500 Main St, Dallas, TX 75201", latitude: "32.7767", longitude: "-96.7970", radius: "25" }} fields={[{ name: "address", label: "Search Address" }, { name: "latitude", label: "Latitude" }, { name: "longitude", label: "Longitude" }, { name: "radius", label: "Radius (miles)", type: "number" }]} />;
}

export function MediaGalleryForm() {
  return <CollectionForm section="media" apiEndpoint="/companies/gallery" title="Media Gallery" description="Choose photos or videos from your device to build your company gallery." itemName="Media item" initial={{ type: "Image or video", media: "", caption: "Emergency repair team" }} fields={[{ name: "type", label: "Media type" }, { name: "media", label: "Image or Video", type: "media", required: true }, { name: "caption", label: "Caption", type: "textarea" }]} />;
}

/** Offers with several coupon codes, each with its own discount (saved to /api/companies/special-offers). */
export function SpecialOffersForm() {
  return <SpecialOffersEditor apiEndpoint="/companies/special-offers" servicesEndpoint="/companies/services" />;
}

/** Reviews & Ratings: customers' PlumberFinder reviews (reply, report) and the Google Business Profile link. */
export function CustomerReviewsForm() {
  return <ProviderReviews base="/companies" />;
}

export function ServiceAreasForm() {
  return <ServiceAreasEditor apiEndpoint="/companies/service-areas" servicesEndpoint="/companies/services" />;
}

/** Services with category, price, duration, and what's included (saved to /api/companies/services). */
export function ServicesForm() {
  return <ServicesEditor apiEndpoint="/companies/services" />;
}

export function SocialLinksForm() {
  return <SectionForm section="social-links" apiEndpoint="/companies/social-links" title="Social Links" description="Add your social media pages. They appear as icons in your public profile header." defaults={socialExamples} fields={socialFields} />;
}

export function TeamMembersForm() {
  return <CollectionForm section="team" apiEndpoint="/companies/team" title="Team Members" description="Add the people customers may see on your public profile." itemName="Team member" initial={{ name: "Chris Bennett", role: "Owner", bio: "Licensed plumbing professional.", photo: "", specialties: "Leak repair, Water heaters", experienceYears: "12", certificates: "Master Plumber License", licenseNumber: "", availability: "Mon–Fri", joinedYear: "" }} fields={[{ name: "name", label: "Name", required: true }, { name: "role", label: "Role" }, { name: "specialties", label: "Specialties (comma-separated)" }, { name: "experienceYears", label: "Years of experience", type: "number" }, { name: "certificates", label: "Certificates (comma-separated)" }, { name: "licenseNumber", label: "License number" }, { name: "availability", label: "Availability" }, { name: "joinedYear", label: "Year joined the company", type: "number" }, { name: "bio", label: "Bio", type: "textarea" }, { name: "photo", label: "Photo", type: "image" }]} />;
}

export function VerificationForm() {
  return <SectionForm section="verification" title="Documents & Verification" description="Keep the document references used for verification up to date." defaults={{ license: "", insurance: "", panVat: "", registrationCertificate: "" }} fields={[{ name: "license", label: "License Document URL", type: "url" }, { name: "insurance", label: "Insurance Document URL", type: "url" }, { name: "panVat", label: "PAN / VAT Document URL", type: "url" }, { name: "registrationCertificate", label: "Registration Certificate URL", type: "url" }]} />;
}
