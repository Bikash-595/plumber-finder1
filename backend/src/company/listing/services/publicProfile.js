import { Company } from "../../../auth/company/models/Company.js";
import { CompanyBlog } from "../../blogs/models/CompanyBlog.js";
import { CompanyBookingSettings } from "../../booking/models/CompanyBookingSettings.js";
import { CompanyOverview } from "../../company-overview/models/CompanyOverview.js";
import { CompanyFaq } from "../../faqs/models/CompanyFaq.js";
import { CompanyGalleryItem } from "../../gallery/models/CompanyGalleryItem.js";
import { CompanyHeaderProfile } from "../../header-profile/models/CompanyHeaderProfile.js";
import { CompanyContact } from "../../onboarding/models/CompanyContact.js";
import { CompanyLocations } from "../../onboarding/models/CompanyLocations.js";
import { CompanyOnboardingDraft } from "../../onboarding/models/CompanyOnboardingDraft.js";
import { CompanyOperations } from "../../onboarding/models/CompanyOperations.js";
import { CompanyProfile } from "../../onboarding/models/CompanyProfile.js";
import { CompanyProject } from "../../previous-projects/models/CompanyProject.js";
import { CompanyReview } from "../../reviews/models/CompanyReview.js";
import { CompanyServiceArea } from "../../service-areas/models/CompanyServiceArea.js";
import { CompanyServiceOffering } from "../../services/models/CompanyServiceOffering.js";
import { CompanySpecialOffer } from "../../special-offers/models/CompanySpecialOffer.js";
import { CompanyTeamMember } from "../../team/models/CompanyTeamMember.js";
import { CompanySocialLinks } from "../../social-links/models/CompanySocialLinks.js";
import { currentOffers, publishedBlogs, visibleProjects } from "../../../shared/profileSections/publicFilters.js";
import { firstPoint, publishedBlogCounts } from "../../../shared/profileSections/cardExtras.js";

const hidden = "-company -__v";
const byPosition = { position: 1, createdAt: 1 };
const byCompany = (docs) => new Map(docs.map((doc) => [String(doc.company ?? doc._id), doc]));
const firstNumber = (...values) => values.find((value) => typeof value === "number" && Number.isFinite(value) && value > 0);
const numberFrom = (value) => { const n = Number(String(value ?? "").replace(/[^0-9.]/g, "")); return Number.isFinite(n) && n > 0 ? n : undefined; };

// Wizard answers that are safe to show publicly (registration and tax numbers stay private).
const publicWizardFields = ["slogan", "longDescription", "missionStatement", "visionStatement", "companyHistory", "founderStory", "coreValues", "businessGoals", "companyType", "yearEstablished", "numberOfEmployees", "numberOfTechnicians", "numberOfVehicles", "languagesSpoken", "serviceCapacity", "operatingRegions", "warranty", "galleryDescription"];
const publicContactFields = ["secondaryPhone", "whatsapp", "emergencyHotline", "supportEmail", "salesEmail", "contactPerson", "contactPersonRole"];
const hoursFields = ["dailyHours", "holidayHours", "emergencyHours", "availability24x7", "seasonalHours", "specialClosures"];
const pick = (source, fields) => Object.fromEntries(fields.filter((field) => source?.[field] !== undefined && source?.[field] !== "" && source?.[field] !== null).map((field) => [field, source[field]]));

/**
 * Card details for the directory (rating, years, team size, offer, hours, ...) for many
 * listings at once — one query per collection, not per company.
 */
export async function cardSummaries(listings) {
  const companies = listings.map((listing) => listing.company);
  const [ratings, overviews, headers, offers, operations, emergencyServices, accounts, teamCounts, drafts, serviceAreas, wizardLocations, blogCounts, teamMembers] = await Promise.all([
    CompanyReview.aggregate([{ $match: { company: { $in: companies } } }, { $group: { _id: "$company", rating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }]),
    CompanyOverview.find({ company: { $in: companies } }).lean(),
    CompanyHeaderProfile.find({ company: { $in: companies } }).select("company ownerName yearsInBusiness licenseNumber insurance certifications").lean(),
    CompanySpecialOffer.find({ company: { $in: companies }, ...currentOffers() }).sort(byPosition).select("company title discount promoCode").lean(),
    CompanyOperations.find({ company: { $in: companies } }).select("company weeklyHours availability24x7").lean(),
    CompanyServiceOffering.find({ company: { $in: companies }, emergency: true }).select("company").lean(),
    Company.find({ _id: { $in: companies } }).select("status").lean(),
    CompanyTeamMember.aggregate([{ $match: { company: { $in: companies } } }, { $group: { _id: "$company", count: { $sum: 1 } } }]),
    CompanyOnboardingDraft.find({ company: { $in: companies } }).select("company formData.yearEstablished formData.numberOfEmployees formData.warranty formData.languagesSpoken").lean(),
    CompanyServiceArea.find({ company: { $in: companies } }).select("company latitude longitude branchLocation").lean(),
    CompanyLocations.find({ company: { $in: companies } }).select("company latitude longitude locations.latitude locations.longitude").lean(),
    publishedBlogCounts(CompanyBlog, "company", companies),
    // Names and roles only — photos can be large uploads and the profile page shows them.
    CompanyTeamMember.find({ company: { $in: companies } }).sort(byPosition).select("company name role").lean(),
  ]);
  const areasByCompany = byCompany(serviceAreas);
  const locationsByCompany = byCompany(wizardLocations);
  const teamByCompany = new Map();
  for (const member of teamMembers) {
    const list = teamByCompany.get(String(member.company)) ?? [];
    if (list.length < 4) list.push({ name: member.name, role: member.role });
    teamByCompany.set(String(member.company), list);
  }
  const maps = { ratings: byCompany(ratings), overviews: byCompany(overviews), headers: byCompany(headers), operations: byCompany(operations), accounts: byCompany(accounts), teamCounts: byCompany(teamCounts), drafts: byCompany(drafts) };
  const offersByCompany = new Map();
  for (const offer of offers) if (!offersByCompany.has(String(offer.company))) offersByCompany.set(String(offer.company), offer);
  const emergency = new Set(emergencyServices.map((item) => String(item.company)));

  return new Map(listings.map((listing) => {
    const key = String(listing.company);
    const rating = maps.ratings.get(key);
    const overview = maps.overviews.get(key) ?? {};
    const header = maps.headers.get(key) ?? {};
    const ops = maps.operations.get(key) ?? {};
    const wizard = maps.drafts.get(key)?.formData ?? {};
    const offer = offersByCompany.get(key);
    const established = firstNumber(overview.foundedYear, numberFrom(wizard.yearEstablished));
    const area = areasByCompany.get(key) ?? {};
    const places = locationsByCompany.get(key) ?? {};
    return [key, {
      location: listing.location || area.branchLocation || undefined,
      coordinates: firstPoint({ lat: area.latitude, lng: area.longitude }, ...(places.locations ?? []).map((place) => ({ lat: place.latitude, lng: place.longitude })), { lat: places.latitude, lng: places.longitude }),
      blogCount: blogCounts.get(key) ?? 0,
      teamPreview: teamByCompany.get(key) ?? [],
      rating: rating ? Math.round(rating.rating * 10) / 10 : listing.rating ?? 0,
      reviewCount: rating?.reviewCount ?? listing.reviewCount ?? 0,
      verified: maps.accounts.get(key)?.status === "approved",
      ownerName: header.ownerName,
      established,
      yearsInBusiness: firstNumber(overview.yearsInBusiness, header.yearsInBusiness) ?? (established ? new Date().getFullYear() - established : undefined),
      teamSize: firstNumber(overview.teamSize, numberFrom(wizard.numberOfEmployees), maps.teamCounts.get(key)?.count),
      licenseNumber: overview.licenseNumber || header.licenseNumber,
      insurance: overview.insurance || header.insurance,
      certifications: overview.certifications || header.certifications,
      responseTime: overview.responseTime,
      averageCost: overview.averageCost,
      projectsCompleted: overview.projectsCompleted,
      warranty: wizard.warranty,
      languages: wizard.languagesSpoken,
      offer: offer ? { title: offer.title, discount: offer.discount, promoCode: offer.promoCode } : undefined,
      isEmergency: emergency.has(key) || /^(yes|true|24\/?7)/i.test(ops.availability24x7 ?? ""),
      weeklyHours: ops.weeklyHours ?? [],
    }];
  }));
}

/** Area services that no longer exist in the Services section are dropped (renamed or deleted services). */
function withCurrentServices(serviceArea, services) {
  if (!serviceArea?.areaDetails) return serviceArea ?? null;
  const names = new Set(services.map((service) => service.name.toLowerCase()));
  return { ...serviceArea, areaDetails: serviceArea.areaDetails.map((area) => ({ ...area, services: (area.services ?? []).filter((name) => names.has(name.toLowerCase())) })) };
}

/** Everything shown on a company's public profile page, for one published listing. */
export async function fullProfile(listing) {
  const company = listing.company;
  const [summaries, header, services, gallery, projects, reviews, team, faqs, blogs, offers, booking, serviceArea, operations, locations, contact, profile, draft, socialLinks] = await Promise.all([
    cardSummaries([listing]),
    CompanyHeaderProfile.findOne({ company }).select(hidden).lean(),
    CompanyServiceOffering.find({ company }).sort(byPosition).select(hidden).lean(),
    CompanyGalleryItem.find({ company }).sort(byPosition).select(hidden).lean(),
    CompanyProject.find({ company, ...visibleProjects() }).sort(byPosition).select(hidden).lean(),
    CompanyReview.find({ company }).sort({ createdAt: -1 }).select(hidden).lean(),
    CompanyTeamMember.find({ company }).sort(byPosition).select(hidden).lean(),
    CompanyFaq.find({ company }).sort(byPosition).select(hidden).lean(),
    CompanyBlog.find({ company, ...publishedBlogs() }).sort({ publishDate: -1 }).select(hidden).lean(),
    CompanySpecialOffer.find({ company, ...currentOffers() }).sort(byPosition).select(hidden).lean(),
    CompanyBookingSettings.findOne({ company }).select(hidden).lean(),
    CompanyServiceArea.findOne({ company }).select(hidden).lean(),
    CompanyOperations.findOne({ company }).select(hidden).lean(),
    CompanyLocations.findOne({ company }).select("locations headquarters").lean(),
    CompanyContact.findOne({ company }).lean(),
    CompanyProfile.findOne({ company }).select("companyHistory founderStory businessGoals coreValues").lean(),
    CompanyOnboardingDraft.findOne({ company }).select("formData").lean(),
    CompanySocialLinks.findOne({ company }).select(`${hidden} -_id -createdAt -updatedAt`).lean(),
  ]);
  const { company: _owner, __v, ...publicListing } = listing;
  return {
    ...publicListing,
    ...summaries.get(String(company)),
    header: header ?? null,
    about: { ...pick(draft?.formData, publicWizardFields), ...pick(profile, ["companyHistory", "founderStory", "businessGoals", "coreValues"]) },
    contact: pick(contact, publicContactFields),
    hours: { ...pick(operations, hoursFields), weeklyHours: operations?.weeklyHours ?? [] },
    branches: (locations?.locations ?? []).map(({ _id, ...branch }) => branch),
    // Wizard-only service names still show when the Services section is empty.
    services: services.length ? services : (listing.services ?? []).map((name) => ({ name })),
    gallery, projects, reviews, team, faqs, blogs, offers,
    booking: booking ?? null,
    serviceArea: withCurrentServices(serviceArea, services),
    socialLinks: socialLinks ?? {},
  };
}
