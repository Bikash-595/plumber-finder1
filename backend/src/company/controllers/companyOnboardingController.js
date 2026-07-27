import { CompanyBranding } from "../models/CompanyBranding.js";
import { CompanyContact } from "../models/CompanyContact.js";
import { CompanyGallery } from "../models/CompanyGallery.js";
import { CompanyListing } from "../models/CompanyListing.js";
import { CompanyLocations } from "../models/CompanyLocations.js";
import { CompanyOperations } from "../models/CompanyOperations.js";
import { CompanyProfile } from "../models/CompanyProfile.js";
import { CompanyServices } from "../models/CompanyServices.js";

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const nonEmpty = (items) => items.filter((item) => Object.values(item).some(Boolean));

export async function saveCompanyOnboarding(req, res, next) {
  try {
    const { formData = {}, services = [], locations = [], galleryImages = [], galleryVideos = [] } = req.body;
    if (!formData.companyName?.trim()) return res.status(400).json({ message: "Company name is required." });
    const company = req.auth.sub;
    const safeServices = nonEmpty(services);
    const safeLocations = nonEmpty(locations);
    const safeImages = nonEmpty(galleryImages);
    const safeVideos = nonEmpty(galleryVideos);
    const slug = `${slugify(formData.companyName)}-${company.slice(-6)}`;
    const publicLocation = safeLocations[0];

    const [listing] = await Promise.all([
      CompanyListing.findOneAndUpdate({ company }, { company, slug, companyName: formData.companyName, tagline: formData.tagline, description: formData.shortDescription, logo: formData.companyLogo, coverImage: formData.coverImage, phone: formData.primaryPhone, email: formData.email, website: formData.website, location: publicLocation?.address || formData.headquarters, city: publicLocation?.city, state: publicLocation?.state, services: safeServices.map((item) => item.name).filter(Boolean), serviceAreas: (formData.multipleServiceAreas || formData.serviceAreas || "").split(",").map((value) => value.trim()).filter(Boolean), isPublished: true }, { new: true, upsert: true, runValidators: true }),
      CompanyProfile.findOneAndUpdate({ company }, { company, companyHistory: formData.companyHistory, founderStory: formData.founderStory, businessGoals: formData.businessGoals, coreValues: formData.coreValues, registration: { businessRegistrationNumber: formData.businessRegistrationNumber, taxIdentificationNumber: formData.taxIdentificationNumber, vatGstNumber: formData.vatGstNumber, employerIdentificationNumber: formData.employerIdentificationNumber }, operations: { companyType: formData.companyType, businessStructure: formData.businessStructure, yearEstablished: formData.yearEstablished, numberOfEmployees: formData.numberOfEmployees, numberOfTechnicians: formData.numberOfTechnicians, numberOfVehicles: formData.numberOfVehicles, companySize: formData.companySize, languagesSpoken: formData.languagesSpoken, serviceCapacity: formData.serviceCapacity, annualRevenueRange: formData.annualRevenueRange, operatingRegions: formData.operatingRegions } }, { new: true, upsert: true }),
      CompanyBranding.findOneAndUpdate({ company }, { company, ...formData }, { new: true, upsert: true }),
      CompanyGallery.findOneAndUpdate({ company }, { company, description: formData.galleryDescription, images: safeImages, videos: safeVideos }, { new: true, upsert: true }),
      CompanyContact.findOneAndUpdate({ company }, { company, primaryPhone: formData.primaryPhone, secondaryPhone: formData.secondaryPhone, whatsapp: formData.whatsapp, smsNumber: formData.smsNumber, email: formData.email, supportEmail: formData.supportEmail, salesEmail: formData.salesEmail, emergencyHotline: formData.emergencyHotline, website: formData.website, contactPerson: formData.contactPerson, contactPersonRole: formData.contactPersonRole }, { new: true, upsert: true }),
      CompanyLocations.findOneAndUpdate({ company }, { company, headquarters: formData.headquarters, branchLocations: formData.branchLocations, franchiseLocations: formData.franchiseLocations, serviceRadius: formData.serviceRadius, serviceAreas: formData.multipleServiceAreas, cities: formData.multipleCities, states: formData.multipleStates, countries: formData.operatingCountries, mapUrl: formData.googleMapsIntegration, latitude: formData.latitude, longitude: formData.longitude, locations: safeLocations }, { new: true, upsert: true }),
      CompanyOperations.findOneAndUpdate({ company }, { company, dailyHours: formData.dailyHours, holidayHours: formData.holidayHours, emergencyHours: formData.emergencyHours, availability24x7: formData.availability24x7, seasonalHours: formData.seasonalHours, specialClosures: formData.specialClosures }, { new: true, upsert: true }),
      CompanyServices.findOneAndUpdate({ company }, { company, category: formData.serviceCategory, name: formData.serviceName, description: formData.serviceDescription, features: formData.serviceFeatures, benefits: formData.serviceBenefits, areas: formData.serviceAreas, pricing: formData.servicePricing, duration: formData.estimatedDuration, warranty: formData.warranty, faqs: formData.serviceFaqs, services: safeServices }, { new: true, upsert: true }),
    ]);
    res.status(201).json({ message: "Company listing published.", data: listing });
  } catch (error) { next(error); }
}

export async function getPublishedCompanies(_req, res, next) {
  try { res.json({ data: await CompanyListing.find({ isPublished: true }).sort({ createdAt: -1 }) }); } catch (error) { next(error); }
}
