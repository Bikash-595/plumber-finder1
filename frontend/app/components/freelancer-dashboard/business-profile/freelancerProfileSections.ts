import type { ComponentType } from "react";
import FreelancerBlogsForm from "./sections/blogs/FreelancerBlogsForm";
import FreelancerBookingForm from "./sections/booking/FreelancerBookingForm";
import FreelancerContactForm from "./sections/contact/FreelancerContactForm";
import FreelancerFaqsForm from "./sections/faqs/FreelancerFaqsForm";
import FreelancerGalleryForm from "./sections/gallery/FreelancerGalleryForm";
import FreelancerHeaderProfileForm from "./sections/header-profile/FreelancerHeaderProfileForm";
import FreelancerMapsForm from "./sections/maps/FreelancerMapsForm";
import FreelancerOffersForm from "./sections/offers/FreelancerOffersForm";
import FreelancerOpeningHoursForm from "./sections/opening-hours/FreelancerOpeningHoursForm";
import FreelancerOverviewForm from "./sections/overview/FreelancerOverviewForm";
import FreelancerProjectsForm from "./sections/projects/FreelancerProjectsForm";
import FreelancerReviewsForm from "./sections/reviews/FreelancerReviewsForm";
import FreelancerSeoForm from "./sections/seo/FreelancerSeoForm";
import FreelancerServiceAreasForm from "./sections/service-areas/FreelancerServiceAreasForm";
import FreelancerServicesForm from "./sections/services/FreelancerServicesForm";
import FreelancerSocialLinksForm from "./sections/social-links/FreelancerSocialLinksForm";
import FreelancerVerificationForm from "./sections/verification/FreelancerVerificationForm";

// Every section of a freelancer's Business Profile. Each section lives in its own folder under ./sections
// (the form component, plus config.ts with its fields where it has any). This list drives the section menu,
// the overview cards, and the /freelancer/business-profile/[section] route.
// To add a section: create ./sections/<slug>/, then add one line here.

export type FreelancerProfileSection = {
  /** URL segment: /freelancer/business-profile/<slug> */
  slug: string;
  label: string;
  /** One line on the overview card. */
  about: string;
  Form: ComponentType;
};

export const freelancerProfileSections: FreelancerProfileSection[] = [
  { slug: "header-profile", label: "Your Profile", about: "Photo, cover photos, name, trade, bio and credentials at the top of your page.", Form: FreelancerHeaderProfileForm },
  { slug: "overview", label: "Overview", about: "Experience, specialties, languages and response time.", Form: FreelancerOverviewForm },
  { slug: "services", label: "Services", about: "Each service with price, photos, videos and its own page.", Form: FreelancerServicesForm },
  { slug: "gallery", label: "Work Gallery", about: "Photos and videos of your work.", Form: FreelancerGalleryForm },
  { slug: "projects", label: "Previous Projects", about: "Before-and-after case studies with results.", Form: FreelancerProjectsForm },
  { slug: "reviews", label: "Reviews & Ratings", about: "Read, reply to and report customer reviews.", Form: FreelancerReviewsForm },
  { slug: "faqs", label: "FAQs", about: "Answers to the questions customers ask before booking.", Form: FreelancerFaqsForm },
  { slug: "service-areas", label: "Service Areas", about: "The places you cover, and what you offer in each.", Form: FreelancerServiceAreasForm },
  { slug: "maps", label: "Google Maps", about: "Where you're based, your map pin and travel radius.", Form: FreelancerMapsForm },
  { slug: "opening-hours", label: "Opening Hours", about: "Your working week, 24/7 availability and holidays.", Form: FreelancerOpeningHoursForm },
  { slug: "contact", label: "Contact", about: "Phones, WhatsApp, email, website and an emergency line.", Form: FreelancerContactForm },
  { slug: "social-links", label: "Social Links", about: "Facebook, Instagram and more, shown on your profile.", Form: FreelancerSocialLinksForm },
  { slug: "booking", label: "Booking", about: "Instant booking, working days, time slots and cancellation policy.", Form: FreelancerBookingForm },
  { slug: "offers", label: "Special Offers", about: "Discounts and coupon codes customers can use when booking.", Form: FreelancerOffersForm },
  { slug: "seo", label: "SEO & Keywords", about: "Your Google title and description, keywords, and the about card on your profile.", Form: FreelancerSeoForm },
  { slug: "blogs", label: "Blogs", about: "Articles that show your expertise and bring in search traffic.", Form: FreelancerBlogsForm },
  { slug: "verification", label: "Documents", about: "Private links to your licence and insurance for verification.", Form: FreelancerVerificationForm },
];

/** The section for a URL segment, or undefined. */
export const findFreelancerSection = (slug: string) => freelancerProfileSections.find((section) => section.slug === slug);
