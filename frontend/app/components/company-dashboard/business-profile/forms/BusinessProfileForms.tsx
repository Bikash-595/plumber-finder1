import CollectionForm from "../CollectionForm";
import CompanyReviews from "@/components/company-dashboard/reviews/CompanyReviews";
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
  return <SectionForm section="booking" apiEndpoint="/companies/booking" title="Booking Settings" description="Control availability and how customers can request an appointment." defaults={{ instantBooking: true, approvalRequired: false, workingDays: "Monday–Saturday", emergencyBooking: true, cancellationPolicy: "Please cancel at least 24 hours before your appointment." }} fields={[{ name: "instantBooking", label: "Instant Booking", type: "checkbox" }, { name: "approvalRequired", label: "Approval Required", type: "checkbox" }, { name: "workingDays", label: "Working Days" }, { name: "timeSlots", label: "Timing notes (optional)", placeholder: "e.g. Evening visits on request" }, { name: "emergencyBooking", label: "Emergency Booking", type: "checkbox" }, { name: "cancellationPolicy", label: "Cancellation Policy", type: "textarea" }]} />;
}

export function BranchesForm() {
  return <CollectionForm section="branches" apiEndpoint="/companies/branches" title="Branches" description="Your other offices or depots. Branches with coordinates appear as pins on your public profile map." itemName="Branch" initial={{ name: "Uptown", manager: "Chris Bennett", address: "500 Main St", city: "Dallas", state: "TX", zipCode: "75201", phone: "(214) 555-6677", email: "uptown@yourcompany.com", latitude: "32.7767", longitude: "-96.7970", services: "Emergency Service, Sewer Line", hours: "Mon–Sat 8 AM–6 PM" }} fields={[{ name: "name", label: "Branch Name", required: true }, { name: "manager", label: "Manager" }, { name: "address", label: "Street Address" }, { name: "city", label: "City" }, { name: "state", label: "State" }, { name: "zipCode", label: "ZIP Code" }, { name: "phone", label: "Phone", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "latitude", label: "Latitude", type: "number" }, { name: "longitude", label: "Longitude", type: "number" }, { name: "services", label: "Services Available (comma-separated)" }, { name: "hours", label: "Working Hours" }]} />;
}

/** Weekly opening days and times, saved to /api/companies/opening-hours and shown on the public profile. */
export function BusinessHoursForm() {
  return <OpeningHoursForm apiEndpoint="/companies/opening-hours" wizardFallback />;
}

export function CompanyOverviewForm() {
  return <SectionForm section="company-overview" title="Company Overview" description="Tell customers what your company does and why they should choose you." defaults={companyProfileSeed} fields={[{ name: "shortDescription", label: "Short Description", type: "textarea" }, { name: "fullDescription", label: "Full Description", type: "textarea" }, { name: "mission", label: "Mission", type: "textarea" }, { name: "vision", label: "Vision", type: "textarea" }, { name: "whyChooseUs", label: "Why Choose Us", type: "textarea" }]} />;
}

export function ContactInformationForm() {
  return <SectionForm section="contact" apiEndpoint="/companies/contact" title="Contact Information" description="How customers reach you. The main phone, email and website appear on your profile header and directory card." defaults={{ primaryPhone: "(214) 555-6677", secondaryPhone: "(214) 555-6678", whatsapp: "+1 214 555 6677", emergencyHotline: "(214) 555-9111", email: "service@yourcompany.com", supportEmail: "help@yourcompany.com", salesEmail: "quotes@yourcompany.com", website: "https://yourcompany.com", contactPerson: "Chris Bennett", contactPersonRole: "Owner" }} fields={[{ name: "primaryPhone", label: "Main Phone", type: "tel" }, { name: "secondaryPhone", label: "Second Phone", type: "tel" }, { name: "whatsapp", label: "WhatsApp", type: "tel" }, { name: "emergencyHotline", label: "24/7 Emergency Line", type: "tel" }, { name: "email", label: "Main Email", type: "email" }, { name: "supportEmail", label: "Support Email", type: "email" }, { name: "salesEmail", label: "Quotes / Sales Email", type: "email" }, { name: "website", label: "Website", type: "url" }, { name: "contactPerson", label: "Contact Person" }, { name: "contactPersonRole", label: "Their Role" }]} />;
}

export function FaqsForm() {
  return <CollectionForm section="faqs" apiEndpoint="/companies/faqs" title="Frequently Asked Questions" description="Answer booking questions before customers need to ask them." itemName="Question" initial={{ question: "Do you offer emergency service?", answer: "Yes, our team handles urgent plumbing calls." }} fields={[{ name: "question", label: "Question", required: true }, { name: "answer", label: "Answer", type: "textarea", required: true }]} />;
}

export function HeaderProfileForm() {
  return <SectionForm section="header-profile" apiEndpoint="/companies/header-profile" title="Company Profile" description="Your company name, tagline, short bio, logo, and credentials at the top of your public profile. Saving this creates your public page at /company/your-company-name." defaults={companyProfileSeed} fields={[{ name: "logo", label: "Company Logo", type: "image" }, { name: "coverImages", label: "Cover Photos", type: "images", maxImages: 8, legacyField: "coverImage", placeholder: "Add up to 8 wide photos (vans, team, finished jobs). They change automatically at the top of your profile; the first one is the main cover." }, { name: "companyName", label: "Company Name", required: true }, { name: "tagline", label: "Tagline", placeholder: "e.g. Fast, honest plumbing across Dallas since 2015" }, { name: "bio", label: "Short Bio (up to 600 characters, shown at the top of your profile and on your card)", type: "textarea", placeholder: "e.g. Family-owned plumbing company serving Dallas for over 10 years. We specialise in leak repair, water heaters and 24/7 emergency call-outs, with upfront pricing and licensed plumbers on every job." }, { name: "ownerName", label: "Owner Name" }, { name: "companyType", label: "Company Type" }, { name: "yearsInBusiness", label: "Years in Business", type: "number" }, { name: "licenseNumber", label: "License Number" }, { name: "insurance", label: "Insurance" }, { name: "certifications", label: "Certifications" }]} />;
}

export function MapsForm() {
  return <SectionForm section="maps" apiEndpoint="/companies/location" title="Google Maps" description="Your address and exact map position. The address is the location shown on your directory card; the coordinates place your pin on the map." defaults={{ headquarters: "500 Main St, Dallas, TX 75201", latitude: "32.7767", longitude: "-96.7970", serviceRadius: "25", mapUrl: "https://maps.google.com/?q=500+Main+St+Dallas" }} fields={[{ name: "headquarters", label: "Business Address" }, { name: "mapUrl", label: "Google Maps Link", type: "url" }, { name: "latitude", label: "Latitude", type: "number", placeholder: "e.g. 32.7767 — right-click your building in Google Maps to copy it" }, { name: "longitude", label: "Longitude", type: "number", placeholder: "e.g. -96.7970" }, { name: "serviceRadius", label: "Travel Radius (miles)", type: "number" }]} />;
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
  return <CompanyReviews />;
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
  return <SectionForm section="verification" apiEndpoint="/companies/verification" title="Documents & Verification" description="Links to the documents Plumber Finder uses to verify your company (for example a shared Google Drive or Dropbox file). Only you and the Plumber Finder team can see them — they are never shown on your profile." defaults={{ license: "https://drive.google.com/…/license.pdf", insurance: "https://drive.google.com/…/insurance.pdf", panVat: "", registrationCertificate: "", notes: "" }} fields={[{ name: "license", label: "License Document Link", type: "url" }, { name: "insurance", label: "Insurance Certificate Link", type: "url" }, { name: "panVat", label: "PAN / VAT Document Link", type: "url" }, { name: "registrationCertificate", label: "Registration Certificate Link", type: "url" }, { name: "notes", label: "Notes for the reviewer", type: "textarea" }]} />;
}
