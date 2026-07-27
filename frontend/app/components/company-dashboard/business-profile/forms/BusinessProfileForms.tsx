import CollectionForm from "../CollectionForm";
import SectionForm from "../SectionForm";
import { companyProfileSeed } from "../profileStore";

export function BookingSettingsForm() {
  return <SectionForm section="booking" title="Booking Settings" description="Control availability and how customers can request an appointment." defaults={{ instantBooking: true, approvalRequired: false, workingDays: "Monday–Saturday", timeSlots: "8:00 AM–6:00 PM", emergencyBooking: true, cancellationPolicy: "Please cancel at least 24 hours before your appointment." }} fields={[{ name: "instantBooking", label: "Instant Booking", type: "checkbox" }, { name: "approvalRequired", label: "Approval Required", type: "checkbox" }, { name: "workingDays", label: "Working Days" }, { name: "timeSlots", label: "Time Slots" }, { name: "emergencyBooking", label: "Emergency Booking", type: "checkbox" }, { name: "cancellationPolicy", label: "Cancellation Policy", type: "textarea" }]} />;
}

export function BranchesForm() {
  return <CollectionForm section="branches" title="Branches" description="Support multiple locations with their own service coverage and working hours." itemName="Branch" initial={{ name: "Uptown", manager: "Chris Bennett", address: "500 Main St, Dallas, TX 75201", phone: "(214) 555-6677", email: "service@dallasrapidplumbers.com", mapLocation: "32.7767, -96.7970", latitude: "32.7767", longitude: "-96.7970", services: "Emergency Service, Sewer Line", hours: "Mon–Sat 8 AM–6 PM" }} fields={[{ name: "name", label: "Branch Name" }, { name: "manager", label: "Manager" }, { name: "address", label: "Address", type: "textarea" }, { name: "phone", label: "Phone", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "mapLocation", label: "Google Map Location" }, { name: "latitude", label: "Latitude" }, { name: "longitude", label: "Longitude" }, { name: "services", label: "Services Available" }, { name: "hours", label: "Working Hours" }]} />;
}

export function BusinessHoursForm() {
  return <SectionForm section="business-hours" title="Business Hours" description="Set your normal opening times. Add 24-hour or closed notes for each day." defaults={{ monday: "8:00 AM – 6:00 PM", tuesday: "8:00 AM – 6:00 PM", wednesday: "8:00 AM – 6:00 PM", thursday: "8:00 AM – 6:00 PM", friday: "8:00 AM – 6:00 PM", saturday: "8:00 AM – 2:00 PM", sunday: "Closed" }} fields={[{ name: "monday", label: "Monday" }, { name: "tuesday", label: "Tuesday" }, { name: "wednesday", label: "Wednesday" }, { name: "thursday", label: "Thursday" }, { name: "friday", label: "Friday" }, { name: "saturday", label: "Saturday" }, { name: "sunday", label: "Sunday" }]} />;
}

export function CompanyOverviewForm() {
  return <SectionForm section="company-overview" title="Company Overview" description="Tell customers what your company does and why they should choose you." defaults={companyProfileSeed} fields={[{ name: "shortDescription", label: "Short Description", type: "textarea" }, { name: "fullDescription", label: "Full Description", type: "textarea" }, { name: "mission", label: "Mission", type: "textarea" }, { name: "vision", label: "Vision", type: "textarea" }, { name: "whyChooseUs", label: "Why Choose Us", type: "textarea" }]} />;
}

export function ContactInformationForm() {
  return <SectionForm section="contact" title="Contact Information" description="Keep customer-facing contact channels accurate." defaults={companyProfileSeed} fields={[{ name: "phone", label: "Phone", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "website", label: "Website", type: "url" }, { name: "whatsapp", label: "WhatsApp", type: "tel" }]} />;
}

export function FaqsForm() {
  return <CollectionForm section="faqs" title="Frequently Asked Questions" description="Answer booking questions before customers need to ask them." itemName="Question" initial={{ question: "Do you offer emergency service?", answer: "Yes, our team handles urgent plumbing calls." }} fields={[{ name: "question", label: "Question" }, { name: "answer", label: "Answer", type: "textarea" }]} />;
}

export function HeaderProfileForm() {
  return <SectionForm section="header-profile" apiEndpoint="/companies/header-profile" title="Header Profile" description="Set the essential identity displayed at the top of your public listing." defaults={companyProfileSeed} fields={[{ name: "logo", label: "Company Logo", type: "image" }, { name: "coverImage", label: "Cover Image", type: "image" }, { name: "companyName", label: "Company Name" }, { name: "ownerName", label: "Owner Name" }, { name: "companyType", label: "Company Type" }, { name: "yearsInBusiness", label: "Years in Business", type: "number" }, { name: "licenseNumber", label: "License Number" }, { name: "insurance", label: "Insurance" }, { name: "certifications", label: "Certifications" }]} />;
}

export function MapsForm() {
  return <SectionForm section="maps" title="Google Maps" description="Enter your map coordinates and booking radius." defaults={{ address: "500 Main St, Dallas, TX 75201", latitude: "32.7767", longitude: "-96.7970", radius: "25" }} fields={[{ name: "address", label: "Search Address" }, { name: "latitude", label: "Latitude" }, { name: "longitude", label: "Longitude" }, { name: "radius", label: "Radius (miles)", type: "number" }]} />;
}

export function MediaGalleryForm() {
  return <CollectionForm section="media" title="Media Gallery" description="Choose photos or videos from your device to build your company gallery." itemName="Media item" initial={{ type: "Image or video", media: "", caption: "Emergency repair team" }} fields={[{ name: "type", label: "Media type" }, { name: "media", label: "Image or Video", type: "media" }, { name: "caption", label: "Caption", type: "textarea" }]} />;
}

export function SpecialOffersForm() {
  return <CollectionForm section="offers" title="Special Offers" description="Set the details and dates for offers customers can claim." itemName="Offer" initial={{ title: "Free estimate", description: "Free estimate for qualifying repairs.", discount: "", promoCode: "RAPIDFREE", startDate: "", endDate: "", image: "" }} fields={[{ name: "title", label: "Offer Title" }, { name: "description", label: "Description", type: "textarea" }, { name: "discount", label: "Discount" }, { name: "promoCode", label: "Promo Code" }, { name: "startDate", label: "Start Date", type: "date" }, { name: "endDate", label: "End Date", type: "date" }, { name: "image", label: "Offer Image", type: "image" }]} />;
}

export function CustomerReviewsForm() {
  return <CollectionForm section="reviews" title="Customer Reviews" description="Manage approved manual reviews while API-sourced reviews are being connected." itemName="Review" initial={{ customer: "Jordan Smith", rating: "5", review: "Fast and professional emergency repair.", photo: "" }} fields={[{ name: "customer", label: "Customer Name" }, { name: "rating", label: "Rating (1–5)", type: "number" }, { name: "review", label: "Review", type: "textarea" }, { name: "photo", label: "Customer Photo", type: "image" }]} />;
}

export function ServiceAreasForm() {
  return <SectionForm section="service-areas" title="Service Areas" description="Define the cities, neighbourhoods, and service radius customers can book." defaults={{ areasCovered: "Dallas, Plano, Irving", radius: "25", branchLocation: "Dallas, TX" }} fields={[{ name: "areasCovered", label: "Areas Covered", type: "textarea" }, { name: "radius", label: "Service Radius (miles)", type: "number" }, { name: "branchLocation", label: "Primary Branch Location" }]} />;
}

export function ServicesForm() {
  return <CollectionForm section="services" title="Services Offered" description="Add every service your business offers. Mark emergency and featured services for prominence." itemName="Service" initial={{ name: "Emergency Plumbing", description: "Rapid response for urgent plumbing issues.", price: "$105/hr", duration: "1 hour", emergency: true, featured: true, image: "" }} fields={[{ name: "name", label: "Service Name" }, { name: "description", label: "Description", type: "textarea" }, { name: "price", label: "Price" }, { name: "duration", label: "Duration" }, { name: "emergency", label: "Emergency Service", type: "checkbox" }, { name: "featured", label: "Featured", type: "checkbox" }, { name: "image", label: "Service Image", type: "image" }]} />;
}

export function SocialLinksForm() {
  return <SectionForm section="social-links" title="Social Links" description="Add social accounts customers can use to learn more about your work." defaults={companyProfileSeed} fields={[{ name: "facebook", label: "Facebook", type: "url" }, { name: "instagram", label: "Instagram", type: "url" }, { name: "linkedin", label: "LinkedIn", type: "url" }, { name: "youtube", label: "YouTube", type: "url" }, { name: "tiktok", label: "TikTok", type: "url" }]} />;
}

export function TeamMembersForm() {
  return <CollectionForm section="team" title="Team Members" description="Add the people customers may see on your public profile." itemName="Team member" initial={{ name: "Chris Bennett", role: "Owner", bio: "Licensed plumbing professional.", photo: "" }} fields={[{ name: "name", label: "Name" }, { name: "role", label: "Role" }, { name: "bio", label: "Bio", type: "textarea" }, { name: "photo", label: "Photo", type: "image" }]} />;
}

export function VerificationForm() {
  return <SectionForm section="verification" title="Documents & Verification" description="Keep the document references used for verification up to date." defaults={{ license: "", insurance: "", panVat: "", registrationCertificate: "" }} fields={[{ name: "license", label: "License Document URL", type: "url" }, { name: "insurance", label: "Insurance Document URL", type: "url" }, { name: "panVat", label: "PAN / VAT Document URL", type: "url" }, { name: "registrationCertificate", label: "Registration Certificate URL", type: "url" }]} />;
}
