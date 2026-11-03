import { Company } from "../../auth/company/models/Company.js";
import { Freelancer } from "../../auth/freelancer/models/Freelancer.js";
import { CompanyAvailability } from "../../company/availability/models/CompanyAvailability.js";
import { CompanyBookingSettings } from "../../company/booking/models/CompanyBookingSettings.js";
import { FreelancerBookingSettings } from "../../freelancer/booking/models/FreelancerBookingSettings.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { CompanyOpeningHours } from "../../company/opening-hours/models/CompanyOpeningHours.js";
import { CompanySettings } from "../../company/settings/models/CompanySettings.js";
import { FreelancerAvailability } from "../../freelancer/availability/models/FreelancerAvailability.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { FreelancerOpeningHours } from "../../freelancer/opening-hours/models/FreelancerOpeningHours.js";
import { FreelancerSettings } from "../../freelancer/settings/models/FreelancerSettings.js";

// Business accounts: companies and freelancers run the same dashboard tools (analytics, leads, jobs, schedule,
// customers, quotes, availability, settings). The tools are written once; this says where each account type
// keeps its own records. Signed-in requests pick the side from the token (req.auth.accountType); public routes
// set it with useSide().

const freelancerStatus = { verified: "approved", rejected: "rejected" };

export const sides = {
  company: {
    type: "company",
    ownerField: "company",
    Account: Company,
    accountFields: "companyName status emailVerified",
    accountView: (account) => ({ name: account?.companyName, status: account?.status, emailVerified: account?.emailVerified !== false }),
    Listing: CompanyListing,
    listingFields: "companyName slug isPublished logo city state",
    listingView: (listing) => listing && { id: listing._id, slug: listing.slug, name: listing.companyName, published: listing.isPublished !== false, logo: listing.logo ?? null, city: listing.city, state: listing.state, url: `/company/${listing.slug}` },
    OpeningHours: CompanyOpeningHours,
    Settings: CompanySettings,
    Availability: CompanyAvailability,
    BookingSettings: CompanyBookingSettings,
    dashboard: "/company-dashboard",
  },
  freelancer: {
    type: "freelancer",
    ownerField: "freelancer",
    Account: Freelancer,
    accountFields: "name verificationStatus emailVerified",
    accountView: (account) => ({ name: account?.name, status: freelancerStatus[account?.verificationStatus] ?? "pending", emailVerified: account?.emailVerified !== false }),
    Listing: FreelancerListing,
    listingFields: "displayName slug isPublished photo city state",
    listingView: (listing) => listing && { id: listing._id, slug: listing.slug, name: listing.displayName, published: listing.isPublished !== false, logo: listing.photo ?? null, city: listing.city, state: listing.state, url: `/plumber/${listing._id}` },
    OpeningHours: FreelancerOpeningHours,
    Settings: FreelancerSettings,
    Availability: FreelancerAvailability,
    BookingSettings: FreelancerBookingSettings,
    dashboard: "/freelancer",
  },
};

/** The side of this request: set by useSide() on public routes, otherwise the signed-in account's type. */
export const sideOf = (req) => sides[req.side ?? req.auth?.accountType] ?? sides.company;

/** Router middleware: this router serves companies or freelancers (needed on public routes). */
export const useSide = (type) => (req, _res, next) => { req.side = type; next(); };

/** The account's public listing (lean), or null. */
export const listingFor = (type, accountId) => sides[type].Listing.findOne({ [sides[type].ownerField]: accountId }).select(sides[type].listingFields).lean();
