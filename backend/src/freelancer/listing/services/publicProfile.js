import { Freelancer } from "../../../auth/freelancer/models/Freelancer.js";
import { currentOffers, publishedBlogs, visibleProjects } from "../../../shared/profileSections/publicFilters.js";
import { firstPoint, publishedBlogCounts } from "../../../shared/profileSections/cardExtras.js";
import { FreelancerBlog } from "../../blogs/models/FreelancerBlog.js";
import { FreelancerBookingSettings } from "../../booking/models/FreelancerBookingSettings.js";
import { FreelancerFaq } from "../../faqs/models/FreelancerFaq.js";
import { FreelancerGalleryItem } from "../../gallery/models/FreelancerGalleryItem.js";
import { FreelancerHeaderProfile } from "../../header-profile/models/FreelancerHeaderProfile.js";
import { FreelancerOpeningHours } from "../../opening-hours/models/FreelancerOpeningHours.js";
import { FreelancerOverview } from "../../overview/models/FreelancerOverview.js";
import { FreelancerProject } from "../../previous-projects/models/FreelancerProject.js";
import { FreelancerReview } from "../../reviews/models/FreelancerReview.js";
import { FreelancerServiceArea } from "../../service-areas/models/FreelancerServiceArea.js";
import { FreelancerServiceOffering } from "../../services/models/FreelancerServiceOffering.js";
import { FreelancerSpecialOffer } from "../../special-offers/models/FreelancerSpecialOffer.js";
import { FreelancerSocialLinks } from "../../social-links/models/FreelancerSocialLinks.js";

const hidden = "-freelancer -__v";
const byPosition = { position: 1, createdAt: 1 };
const byOwner = (docs) => new Map(docs.map((doc) => [String(doc.freelancer ?? doc._id), doc]));

/**
 * Card details for the directory (rating, experience, offer, hours, ...) for many freelancer
 * listings at once — one query per collection, not per freelancer.
 */
export async function cardSummaries(listings) {
  const freelancers = listings.map((listing) => listing.freelancer);
  const match = { freelancer: { $in: freelancers } };
  const [ratings, headers, overviews, offers, hours, emergencyServices, accounts, serviceAreas, blogCounts] = await Promise.all([
    FreelancerReview.aggregate([{ $match: match }, { $group: { _id: "$freelancer", rating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }]),
    FreelancerHeaderProfile.find(match).select("freelancer licenseNumber insurance").lean(),
    FreelancerOverview.find(match).select("freelancer bio specialties certifications languages responseTime jobsCompleted averageCost emergencyAvailable").lean(),
    FreelancerSpecialOffer.find({ ...match, ...currentOffers() }).sort(byPosition).select("freelancer title discount promoCode").lean(),
    FreelancerOpeningHours.find(match).select("freelancer weeklyHours availability24x7").lean(),
    FreelancerServiceOffering.find({ ...match, emergency: true }).select("freelancer").lean(),
    Freelancer.find({ _id: { $in: freelancers } }).select("verificationStatus").lean(),
    FreelancerServiceArea.find(match).select("freelancer latitude longitude branchLocation").lean(),
    publishedBlogCounts(FreelancerBlog, "freelancer", freelancers),
  ]);
  const areasByOwner = byOwner(serviceAreas);
  const maps = { ratings: byOwner(ratings), headers: byOwner(headers), overviews: byOwner(overviews), hours: byOwner(hours), accounts: byOwner(accounts) };
  const offerByOwner = new Map();
  for (const offer of offers) if (!offerByOwner.has(String(offer.freelancer))) offerByOwner.set(String(offer.freelancer), offer);
  const emergency = new Set(emergencyServices.map((item) => String(item.freelancer)));

  return new Map(listings.map((listing) => {
    const key = String(listing.freelancer);
    const rating = maps.ratings.get(key);
    const header = maps.headers.get(key) ?? {};
    const overview = maps.overviews.get(key) ?? {};
    const week = maps.hours.get(key) ?? {};
    const offer = offerByOwner.get(key);
    const area = areasByOwner.get(key) ?? {};
    return [key, {
      coordinates: firstPoint({ lat: area.latitude, lng: area.longitude }),
      baseLocation: area.branchLocation || undefined,
      blogCount: blogCounts.get(key) ?? 0,
      rating: rating ? Math.round(rating.rating * 10) / 10 : listing.rating ?? 0,
      reviewCount: rating?.reviewCount ?? listing.reviewCount ?? 0,
      verified: maps.accounts.get(key)?.verificationStatus === "verified",
      licenseNumber: header.licenseNumber,
      insurance: header.insurance,
      bio: overview.bio,
      specialties: overview.specialties ?? [],
      certifications: overview.certifications,
      languages: overview.languages ?? [],
      responseTime: overview.responseTime,
      jobsCompleted: overview.jobsCompleted,
      averageCost: overview.averageCost,
      offer: offer ? { title: offer.title, discount: offer.discount, promoCode: offer.promoCode } : undefined,
      isEmergency: Boolean(overview.emergencyAvailable || week.availability24x7 || emergency.has(key)),
      weeklyHours: week.weeklyHours ?? [],
    }];
  }));
}

/** Area services that no longer exist in the Services section are dropped (renamed or deleted services). */
function withCurrentServices(serviceArea, services) {
  if (!serviceArea?.areaDetails) return serviceArea ?? null;
  const names = new Set(services.map((service) => service.name.toLowerCase()));
  return { ...serviceArea, areaDetails: serviceArea.areaDetails.map((area) => ({ ...area, services: (area.services ?? []).filter((name) => names.has(name.toLowerCase())) })) };
}

/** Everything shown on a freelancer's public profile page, for one published listing. */
export async function fullProfile(listing) {
  const freelancer = listing.freelancer;
  const [summaries, services, gallery, projects, reviews, faqs, blogs, offers, booking, serviceArea, hours, socialLinks] = await Promise.all([
    cardSummaries([listing]),
    FreelancerServiceOffering.find({ freelancer }).sort(byPosition).select(hidden).lean(),
    FreelancerGalleryItem.find({ freelancer }).sort(byPosition).select(hidden).lean(),
    FreelancerProject.find({ freelancer, ...visibleProjects() }).sort(byPosition).select(hidden).lean(),
    FreelancerReview.find({ freelancer }).sort({ createdAt: -1 }).select(hidden).lean(),
    FreelancerFaq.find({ freelancer }).sort(byPosition).select(hidden).lean(),
    FreelancerBlog.find({ freelancer, ...publishedBlogs() }).sort({ publishDate: -1 }).select(hidden).lean(),
    FreelancerSpecialOffer.find({ freelancer, ...currentOffers() }).sort(byPosition).select(hidden).lean(),
    FreelancerBookingSettings.findOne({ freelancer }).select(hidden).lean(),
    FreelancerServiceArea.findOne({ freelancer }).select(hidden).lean(),
    FreelancerOpeningHours.findOne({ freelancer }).select(hidden).lean(),
    FreelancerSocialLinks.findOne({ freelancer }).select(`${hidden} -_id -createdAt -updatedAt`).lean(),
  ]);
  const { freelancer: _owner, __v, ...publicListing } = listing;
  return {
    ...publicListing,
    ...summaries.get(String(freelancer)),
    services: services.length ? services : (listing.services ?? []).map((name) => ({ name })),
    gallery, projects, reviews, faqs, blogs, offers,
    booking: booking ?? null,
    serviceArea: withCurrentServices(serviceArea, services),
    socialLinks: socialLinks ?? {},
    hours: hours ? { weeklyHours: hours.weeklyHours ?? [], availability24x7: hours.availability24x7 ? "Yes" : undefined, emergencyHours: hours.emergencyHours, holidayHours: hours.holidayHours, specialClosures: hours.specialClosures } : { weeklyHours: [] },
  };
}
