import { Company } from "../../../auth/company/models/Company.js";
import { galleryConfig } from "../../gallery/config/galleryConfig.js";
import { detectMediaKind } from "../../gallery/controllers/galleryController.js";
import { CompanyGalleryItem } from "../../gallery/models/CompanyGalleryItem.js";
import { CompanyHeaderProfile } from "../../header-profile/models/CompanyHeaderProfile.js";
import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { CompanyServiceArea } from "../../service-areas/models/CompanyServiceArea.js";
import { servicesConfig } from "../../services/config/servicesConfig.js";
import { CompanyServiceOffering } from "../../services/models/CompanyServiceOffering.js";
import { validateFields } from "../../shared/validateFields.js";
import { CompanyBranding } from "../models/CompanyBranding.js";
import { CompanyContact } from "../models/CompanyContact.js";
import { CompanyLocations } from "../models/CompanyLocations.js";
import { CompanyOperations } from "../models/CompanyOperations.js";
import { CompanyProfile } from "../models/CompanyProfile.js";

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const nonEmpty = (items) => items.filter((item) => Object.values(item).some(Boolean));
const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isObjectList = (value) => Array.isArray(value) && value.every(isPlainObject);
// Image fields shown publicly (listing card, branding) must be real image URLs/uploads.
const imageFields = Object.fromEntries(["companyLogo", "darkLogo", "lightLogo", "favicon", "coverImage", "heroBanner", "mobileBanner"].map((field) => [field, { type: "image" }]));

// The wizard seeds the Services and Gallery sections the first time only, so it never
// overwrites what the company later manages in the dashboard. Items that fail the
// section's own validation are skipped.
function validItems(config, items) {
  return items.map((item) => validateFields(config.fields, item)).filter(({ errors }) => !Object.keys(errors).length).map(({ values }) => values).slice(0, config.maxItems);
}

async function seedServices(company, services) {
  if (await CompanyServiceOffering.exists({ company })) return;
  const items = validItems(servicesConfig, services.map((service) => ({ name: service.name, description: service.description, price: service.pricing, duration: service.duration })));
  if (items.length) await CompanyServiceOffering.insertMany(items.map((item, position) => ({ ...item, company, position })));
}

async function seedGallery(company, images, videos) {
  if (await CompanyGalleryItem.exists({ company })) return;
  const items = validItems(galleryConfig, [
    ...images.map((image) => ({ type: "Image", media: image.url, caption: image.caption })),
    ...videos.map((video) => ({ type: "Video", media: video.url, caption: video.title })),
  ]);
  if (items.length) await CompanyGalleryItem.insertMany(items.map((item, position) => ({ ...item, mediaKind: detectMediaKind(item.media), company, position })));
}

/** Dashboard sections own these listing fields once they have data (name/logo/cover, services, areas). */
async function sectionOverrides(company) {
  const [header, services, serviceArea] = await Promise.all([
    CompanyHeaderProfile.findOne({ company }).select("companyName logo coverImage").lean(),
    CompanyServiceOffering.find({ company }).sort({ position: 1, createdAt: 1 }).select("name").lean(),
    CompanyServiceArea.findOne({ company }).select("areas").lean(),
  ]);
  return {
    ...Object.fromEntries(["companyName", "logo", "coverImage"].filter((field) => header?.[field]).map((field) => [field, header[field]])),
    ...(services.length ? { services: services.map((service) => service.name) } : {}),
    ...(serviceArea ? { serviceAreas: serviceArea.areas } : {}),
  };
}

const brandingFields = ["companyLogo", "darkLogo", "lightLogo", "favicon", "coverImage", "heroBanner", "mobileBanner", "introVideo", "brandColors", "brandTypography", "seoTitle", "seoKeywords"];

export async function saveCompanyOnboarding(req, res, next) {
  try {
    const { formData = {}, services = [], locations = [], galleryImages = [], galleryVideos = [] } = req.body;
    if (!isPlainObject(formData) || typeof formData.companyName !== "string" || !formData.companyName.trim()) {
      return res.status(400).json({ message: "Company name is required." });
    }
    if (![services, locations, galleryImages, galleryVideos].every(isObjectList)) {
      return res.status(400).json({ message: "services, locations, galleryImages, and galleryVideos must be lists of objects." });
    }
    const serviceAreasText = formData.multipleServiceAreas || formData.serviceAreas || "";
    if (typeof serviceAreasText !== "string") return res.status(400).json({ message: "Service areas must be a comma-separated string." });
    const imageCheck = validateFields(imageFields, Object.fromEntries(Object.keys(imageFields).filter((field) => formData[field] !== undefined).map((field) => [field, formData[field]])));
    if (Object.keys(imageCheck.errors).length) {
      const [field, problem] = Object.entries(imageCheck.errors)[0];
      return res.status(400).json({ message: `${field} ${problem}.`, errors: imageCheck.errors });
    }
    const company = req.auth.sub;
    // A company suspended by an admin stays hidden even if it re-submits the wizard.
    const account = await Company.findById(company).select("status").lean();
    const isPublished = account?.status !== "suspended";
    const branding = Object.fromEntries(brandingFields.map((field) => [field, formData[field]]));
    const safeServices = nonEmpty(services);
    const safeLocations = nonEmpty(locations);
    const safeImages = nonEmpty(galleryImages);
    const safeVideos = nonEmpty(galleryVideos);
    const slug = `${slugify(formData.companyName) || "company"}-${company.slice(-6)}`;
    const publicLocation = safeLocations[0];

    const [listing] = await Promise.all([
      CompanyListing.findOneAndUpdate({ company }, { company, slug, companyName: formData.companyName, tagline: formData.tagline, description: formData.shortDescription, logo: formData.companyLogo, coverImage: formData.coverImage, phone: formData.primaryPhone, email: formData.email, website: formData.website, location: publicLocation?.address || formData.headquarters, city: publicLocation?.city, state: publicLocation?.state, services: safeServices.map((item) => item.name).filter(Boolean), serviceAreas: serviceAreasText.split(",").map((value) => value.trim()).filter(Boolean), isPublished }, { new: true, upsert: true, runValidators: true }),
      CompanyProfile.findOneAndUpdate({ company }, { company, companyHistory: formData.companyHistory, founderStory: formData.founderStory, businessGoals: formData.businessGoals, coreValues: formData.coreValues, registration: { businessRegistrationNumber: formData.businessRegistrationNumber, taxIdentificationNumber: formData.taxIdentificationNumber, vatGstNumber: formData.vatGstNumber, employerIdentificationNumber: formData.employerIdentificationNumber }, operations: { companyType: formData.companyType, businessStructure: formData.businessStructure, yearEstablished: formData.yearEstablished, numberOfEmployees: formData.numberOfEmployees, numberOfTechnicians: formData.numberOfTechnicians, numberOfVehicles: formData.numberOfVehicles, companySize: formData.companySize, languagesSpoken: formData.languagesSpoken, serviceCapacity: formData.serviceCapacity, annualRevenueRange: formData.annualRevenueRange, operatingRegions: formData.operatingRegions } }, { new: true, upsert: true }),
      CompanyBranding.findOneAndUpdate({ company }, { company, ...branding }, { new: true, upsert: true }),
      seedGallery(company, safeImages, safeVideos),
      CompanyContact.findOneAndUpdate({ company }, { company, primaryPhone: formData.primaryPhone, secondaryPhone: formData.secondaryPhone, whatsapp: formData.whatsapp, smsNumber: formData.smsNumber, email: formData.email, supportEmail: formData.supportEmail, salesEmail: formData.salesEmail, emergencyHotline: formData.emergencyHotline, website: formData.website, contactPerson: formData.contactPerson, contactPersonRole: formData.contactPersonRole }, { new: true, upsert: true }),
      CompanyLocations.findOneAndUpdate({ company }, { company, headquarters: formData.headquarters, branchLocations: formData.branchLocations, franchiseLocations: formData.franchiseLocations, serviceRadius: formData.serviceRadius, serviceAreas: formData.multipleServiceAreas, cities: formData.multipleCities, states: formData.multipleStates, countries: formData.operatingCountries, mapUrl: formData.googleMapsIntegration, latitude: formData.latitude, longitude: formData.longitude, locations: safeLocations }, { new: true, upsert: true }),
      CompanyOperations.findOneAndUpdate({ company }, { company, dailyHours: formData.dailyHours, holidayHours: formData.holidayHours, emergencyHours: formData.emergencyHours, availability24x7: formData.availability24x7, seasonalHours: formData.seasonalHours, specialClosures: formData.specialClosures }, { new: true, upsert: true }),
      seedServices(company, safeServices),
    ]);
    // Re-apply section-managed fields so re-running the wizard never overwrites dashboard edits.
    const overrides = await sectionOverrides(company);
    const published = Object.keys(overrides).length ? await CompanyListing.findByIdAndUpdate(listing._id, { $set: overrides }, { new: true }) : listing;
    res.status(201).json({ message: "Company listing published.", data: published });
  } catch (error) { next(error); }
}

