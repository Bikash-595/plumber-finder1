import { Company } from "../../../auth/company/models/Company.js";
import { galleryConfig } from "../../gallery/config/galleryConfig.js";
import { detectMediaKind } from "../../gallery/controllers/galleryController.js";
import { CompanyGalleryItem } from "../../gallery/models/CompanyGalleryItem.js";
import { CompanyHeaderProfile } from "../../header-profile/models/CompanyHeaderProfile.js";
import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { listingSlugUpdate } from "../../listing/services/listingSlug.js";
import { CompanyServiceArea } from "../../service-areas/models/CompanyServiceArea.js";
import { servicesConfig } from "../../services/config/servicesConfig.js";
import { CompanyServiceOffering } from "../../services/models/CompanyServiceOffering.js";
import { validateFields } from "../../shared/validateFields.js";
import { CompanyBranding } from "../models/CompanyBranding.js";
import { CompanyContact } from "../models/CompanyContact.js";
import { CompanyLocations } from "../models/CompanyLocations.js";
import { CompanyOperations } from "../models/CompanyOperations.js";
import { CompanyProfile } from "../models/CompanyProfile.js";
import { CompanyOnboardingDraft } from "../models/CompanyOnboardingDraft.js";
import { onboardingFields, onboardingLimits, onboardingLists, onboardingSteps } from "../config/onboardingSteps.js";
import { cleanWeeklyHours } from "../../../shared/openingHours.js";

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
    CompanyHeaderProfile.findOne({ company }).select("companyName logo coverImage tagline bio").lean(),
    CompanyServiceOffering.find({ company }).sort({ position: 1, createdAt: 1 }).select("name").lean(),
    CompanyServiceArea.findOne({ company }).select("areas").lean(),
  ]);
  return {
    ...Object.fromEntries(["companyName", "logo", "coverImage", "tagline"].filter((field) => header?.[field]).map((field) => [field, header[field]])),
    ...(header?.bio ? { description: header.bio } : {}),
    ...(services.length ? { services: services.map((service) => service.name) } : {}),
    ...(serviceArea ? { serviceAreas: serviceArea.areas } : {}),
  };
}

const brandingFields = ["companyLogo", "darkLogo", "lightLogo", "favicon", "coverImage", "heroBanner", "mobileBanner", "introVideo", "brandColors", "brandTypography", "seoTitle", "seoKeywords"];
const listNames = Object.keys(onboardingLists);
const emptyDraft = () => ({ formData: {}, services: [], locations: [], galleryImages: [], galleryVideos: [], weeklyHours: [], completedSteps: [], submittedAt: null });
const draftShape = (draft) => ({ formData: draft.formData ?? {}, ...Object.fromEntries(listNames.map((name) => [name, draft[name] ?? []])), completedSteps: draft.completedSteps ?? [], submittedAt: draft.submittedAt ?? null });

/** Keeps only the named wizard fields; numbers become strings, anything else is an error. */
function cleanFields(source, fields) {
  const values = {};
  const errors = {};
  for (const field of fields) {
    const value = source[field];
    if (value === undefined || value === null) continue;
    if (typeof value !== "string" && typeof value !== "number") { errors[field] = "must be text"; continue; }
    const text = String(value).trim();
    if (text.length > onboardingLimits.fieldLength) errors[field] = `must be at most ${onboardingLimits.fieldLength} characters`;
    else values[field] = text;
  }
  return { values, errors };
}

/** Validates one repeatable list (services, locations, gallery, opening hours) and keeps only its allowed keys. */
function cleanList(name, items) {
  if (items === undefined) return { values: undefined };
  if (!isObjectList(items)) return { error: `${name} must be a list of objects` };
  if (name === "weeklyHours") return cleanWeeklyHours(items);
  if (items.length > onboardingLimits.listItems) return { error: `${name} can have at most ${onboardingLimits.listItems} items` };
  const values = [];
  for (const item of items) {
    const { values: clean, errors } = cleanFields(item, onboardingLists[name]);
    if (Object.keys(errors).length) return { error: `${name} ${Object.keys(errors)[0]} ${Object.values(errors)[0]}` };
    if (onboardingLists[name].some((key) => item[key] !== undefined && typeof item[key] === "string" && item[key].length > onboardingLimits.itemFieldLength)) return { error: `${name} values must be at most ${onboardingLimits.itemFieldLength} characters` };
    values.push(Object.fromEntries(onboardingLists[name].map((key) => [key, clean[key] ?? ""])));
  }
  return { values };
}

/** Returns a 400 message for a publish payload, or null when it can be published. */
function publishProblem({ formData, services, locations, galleryImages, galleryVideos }) {
  if (!isPlainObject(formData) || typeof formData.companyName !== "string" || !formData.companyName.trim()) return { message: "Company name is required." };
  if (![services, locations, galleryImages, galleryVideos].every(isObjectList)) return { message: "services, locations, galleryImages, and galleryVideos must be lists of objects." };
  const serviceAreasText = formData.multipleServiceAreas || formData.serviceAreas || "";
  if (typeof serviceAreasText !== "string") return { message: "Service areas must be a comma-separated string." };
  const imageCheck = validateFields(imageFields, Object.fromEntries(Object.keys(imageFields).filter((field) => formData[field] !== undefined && formData[field] !== "").map((field) => [field, formData[field]])));
  if (Object.keys(imageCheck.errors).length) {
    const [field, problem] = Object.entries(imageCheck.errors)[0];
    return { message: `${field} ${problem}.`, errors: imageCheck.errors };
  }
  return null;
}

/** Writes the wizard data to the listing and the private company records. */
async function publishListing(company, { formData, services, locations, galleryImages, galleryVideos, weeklyHours = [] }) {
  const serviceAreasText = formData.multipleServiceAreas || formData.serviceAreas || "";
  // A company suspended by an admin stays hidden even if it re-submits the wizard.
  const account = await Company.findById(company).select("status").lean();
  const isPublished = account?.status !== "suspended";
  const branding = Object.fromEntries(brandingFields.map((field) => [field, formData[field]]));
  const safeServices = nonEmpty(services);
  const safeLocations = nonEmpty(locations);
  const safeImages = nonEmpty(galleryImages);
  const safeVideos = nonEmpty(galleryVideos);
  // The header profile's name (if set) wins on the listing, so the URL slug follows it too.
  const header = await CompanyHeaderProfile.findOne({ company }).select("companyName").lean();
  const slugFields = await listingSlugUpdate(company, header?.companyName || formData.companyName);
  const publicLocation = safeLocations[0];

  const [listing] = await Promise.all([
    CompanyListing.findOneAndUpdate({ company }, { company, ...slugFields, companyName: formData.companyName, tagline: formData.tagline, description: formData.shortDescription, logo: formData.companyLogo, coverImage: formData.coverImage, phone: formData.primaryPhone, email: formData.email, website: formData.website, location: publicLocation?.address || formData.headquarters, city: publicLocation?.city, state: publicLocation?.state, services: safeServices.map((item) => item.name).filter(Boolean), serviceAreas: serviceAreasText.split(",").map((value) => value.trim()).filter(Boolean), isPublished }, { new: true, upsert: true, runValidators: true }),
    CompanyProfile.findOneAndUpdate({ company }, { company, companyHistory: formData.companyHistory, founderStory: formData.founderStory, businessGoals: formData.businessGoals, coreValues: formData.coreValues, registration: { businessRegistrationNumber: formData.businessRegistrationNumber, taxIdentificationNumber: formData.taxIdentificationNumber, vatGstNumber: formData.vatGstNumber, employerIdentificationNumber: formData.employerIdentificationNumber }, operations: { companyType: formData.companyType, businessStructure: formData.businessStructure, yearEstablished: formData.yearEstablished, numberOfEmployees: formData.numberOfEmployees, numberOfTechnicians: formData.numberOfTechnicians, numberOfVehicles: formData.numberOfVehicles, companySize: formData.companySize, languagesSpoken: formData.languagesSpoken, serviceCapacity: formData.serviceCapacity, annualRevenueRange: formData.annualRevenueRange, operatingRegions: formData.operatingRegions } }, { new: true, upsert: true }),
    CompanyBranding.findOneAndUpdate({ company }, { company, ...branding }, { new: true, upsert: true }),
    seedGallery(company, safeImages, safeVideos),
    CompanyContact.findOneAndUpdate({ company }, { company, primaryPhone: formData.primaryPhone, secondaryPhone: formData.secondaryPhone, whatsapp: formData.whatsapp, smsNumber: formData.smsNumber, email: formData.email, supportEmail: formData.supportEmail, salesEmail: formData.salesEmail, emergencyHotline: formData.emergencyHotline, website: formData.website, contactPerson: formData.contactPerson, contactPersonRole: formData.contactPersonRole }, { new: true, upsert: true }),
    CompanyLocations.findOneAndUpdate({ company }, { company, headquarters: formData.headquarters, branchLocations: formData.branchLocations, franchiseLocations: formData.franchiseLocations, serviceRadius: formData.serviceRadius, serviceAreas: formData.multipleServiceAreas, cities: formData.multipleCities, states: formData.multipleStates, countries: formData.operatingCountries, mapUrl: formData.googleMapsIntegration, latitude: formData.latitude, longitude: formData.longitude, locations: safeLocations }, { new: true, upsert: true }),
    CompanyOperations.findOneAndUpdate({ company }, { company, dailyHours: formData.dailyHours, holidayHours: formData.holidayHours, emergencyHours: formData.emergencyHours, availability24x7: formData.availability24x7, seasonalHours: formData.seasonalHours, specialClosures: formData.specialClosures, weeklyHours }, { new: true, upsert: true }),
    seedServices(company, safeServices),
  ]);
  // Re-apply section-managed fields so re-running the wizard never overwrites dashboard edits.
  const overrides = await sectionOverrides(company);
  return Object.keys(overrides).length ? CompanyListing.findByIdAndUpdate(listing._id, { $set: overrides }, { new: true }) : listing;
}

/** Rebuilds the wizard form from the saved records, for listings published before drafts existed. */
async function draftFromSavedRecords(company, listing) {
  if (!listing) return emptyDraft();
  const [profile, branding, contact, locations, operations] = await Promise.all([CompanyProfile, CompanyBranding, CompanyContact, CompanyLocations, CompanyOperations].map((model) => model.findOne({ company }).lean()));
  const formData = {
    companyName: listing.companyName, tagline: listing.tagline, shortDescription: listing.description,
    ...profile, ...profile?.registration, ...profile?.operations, ...branding, ...contact, ...operations,
    headquarters: locations?.headquarters, branchLocations: locations?.branchLocations, franchiseLocations: locations?.franchiseLocations, serviceRadius: locations?.serviceRadius, multipleServiceAreas: locations?.serviceAreas, multipleCities: locations?.cities, multipleStates: locations?.states, operatingCountries: locations?.countries, googleMapsIntegration: locations?.mapUrl, latitude: locations?.latitude, longitude: locations?.longitude,
  };
  return {
    ...emptyDraft(),
    formData: cleanFields(formData, onboardingFields).values,
    services: (listing.services ?? []).map((name) => ({ ...Object.fromEntries(onboardingLists.services.map((key) => [key, ""])), name })),
    locations: cleanList("locations", (locations?.locations ?? []).map(({ _id, ...rest }) => rest)).values ?? [],
    weeklyHours: operations?.weeklyHours ?? [],
    completedSteps: onboardingSteps.map((step) => step.id),
    submittedAt: listing.createdAt,
  };
}

/** GET — the company's saved wizard data (so it can resume or edit) and its listing, if published. */
export async function getCompanyOnboarding(req, res, next) {
  try {
    const company = req.auth.sub;
    const [draft, listing] = await Promise.all([
      CompanyOnboardingDraft.findOne({ company }).lean(),
      CompanyListing.findOne({ company }).select("slug companyName isPublished createdAt services").lean(),
    ]);
    const data = draft ? draftShape(draft) : await draftFromSavedRecords(company, listing);
    res.json({ data: { ...data, listing: listing ? { _id: listing._id, slug: listing.slug, companyName: listing.companyName, isPublished: listing.isPublished } : null } });
  } catch (error) { next(error); }
}

/**
 * PUT /steps/:stepId — saves one wizard step to the database. Once the listing has been
 * published, the saved change is applied to the live listing straight away.
 */
export async function saveCompanyOnboardingStep(req, res, next) {
  try {
    const step = onboardingSteps.find((item) => item.id === req.params.stepId);
    if (!step) return res.status(404).json({ message: "Unknown wizard step." });
    const { formData = {} } = req.body ?? {};
    if (!isPlainObject(formData)) return res.status(400).json({ message: "formData must be an object." });

    const { values, errors } = cleanFields(formData, step.fields);
    for (const field of step.required ?? []) if (!values[field]) errors[field] = "is required";
    if (Object.keys(errors).length) {
      const [field, problem] = Object.entries(errors)[0];
      return res.status(400).json({ message: `${field} ${problem}.`, errors });
    }
    const lists = {};
    for (const name of step.lists ?? []) {
      const { values: items, error } = cleanList(name, req.body[name]);
      if (error) return res.status(400).json({ message: `${error}.` });
      if (items) lists[name] = items;
    }
    const imageCheck = publishProblem({ formData: { companyName: "check", ...values }, services: [], locations: [], galleryImages: [], galleryVideos: [] });
    if (imageCheck) return res.status(400).json(imageCheck);

    const company = req.auth.sub;
    // Fields cleared in the form are saved as empty, so the step always matches what was submitted.
    const fieldUpdates = Object.fromEntries(step.fields.map((field) => [`formData.${field}`, values[field] ?? ""]));
    let draft = await CompanyOnboardingDraft.findOneAndUpdate({ company }, { $set: { ...fieldUpdates, ...lists }, $addToSet: { completedSteps: step.id }, $setOnInsert: { company } }, { new: true, upsert: true, lean: true });

    // Listings published before drafts existed: fill the rest of the draft from the saved records first.
    let listing = null;
    if (!draft.submittedAt && (await CompanyListing.exists({ company }))) {
      const saved = await draftFromSavedRecords(company, await CompanyListing.findOne({ company }).lean());
      draft = await CompanyOnboardingDraft.findOneAndUpdate({ company }, { $set: { formData: { ...saved.formData, ...draft.formData }, ...Object.fromEntries(listNames.map((name) => [name, lists[name] ?? (draft[name]?.length ? draft[name] : saved[name])])), completedSteps: saved.completedSteps, submittedAt: saved.submittedAt } }, { new: true, lean: true });
    }
    if (draft.submittedAt) {
      const payload = draftShape(draft);
      const problem = publishProblem(payload);
      if (problem) return res.status(400).json(problem);
      listing = await publishListing(company, payload);
    }
    res.json({ message: listing ? "Saved. Your live listing has been updated." : "Step saved.", data: draftShape(draft), listing });
  } catch (error) { next(error); }
}

/** POST — submits the whole wizard: saves every step and publishes (or re-publishes) the listing. */
export async function saveCompanyOnboarding(req, res, next) {
  try {
    const { formData = {}, services = [], locations = [], galleryImages = [], galleryVideos = [], weeklyHours = [] } = req.body ?? {};
    const problem = publishProblem({ formData, services, locations, galleryImages, galleryVideos });
    if (problem) return res.status(400).json(problem);
    const fields = cleanFields(formData, onboardingFields);
    if (Object.keys(fields.errors).length) {
      const [field, issue] = Object.entries(fields.errors)[0];
      return res.status(400).json({ message: `${field} ${issue}.`, errors: fields.errors });
    }
    const lists = {};
    for (const [name, items] of Object.entries({ services, locations, galleryImages, galleryVideos, weeklyHours })) {
      const { values, error } = cleanList(name, items);
      if (error) return res.status(400).json({ message: `${error}.` });
      lists[name] = values;
    }
    const company = req.auth.sub;
    const payload = { formData: fields.values, ...lists };
    const published = await publishListing(company, payload);
    const existing = await CompanyOnboardingDraft.findOne({ company }).select("submittedAt").lean();
    await CompanyOnboardingDraft.findOneAndUpdate({ company }, { $set: { ...payload, completedSteps: onboardingSteps.map((step) => step.id), submittedAt: existing?.submittedAt ?? new Date() }, $setOnInsert: { company } }, { upsert: true });
    res.status(201).json({ message: "Company listing published.", data: published });
  } catch (error) { next(error); }
}

/**
 * DELETE /steps/:stepId — clears one step's saved answers. On a live listing the change is
 * published straight away; Company Information can't be cleared while live (delete the listing instead).
 */
export async function clearCompanyOnboardingStep(req, res, next) {
  try {
    const step = onboardingSteps.find((item) => item.id === req.params.stepId);
    if (!step) return res.status(404).json({ message: "Unknown wizard step." });
    const company = req.auth.sub;
    const existing = await CompanyOnboardingDraft.findOne({ company }).select("submittedAt").lean();
    if (!existing) return res.json({ message: "Nothing saved for this step.", data: emptyDraft(), listing: null });
    if (existing.submittedAt && step.required) {
      return res.status(400).json({ message: "Company information is needed while your listing is live. Delete the listing instead." });
    }
    const draft = await CompanyOnboardingDraft.findOneAndUpdate(
      { company },
      { $set: { ...Object.fromEntries(step.fields.map((field) => [`formData.${field}`, ""])), ...Object.fromEntries((step.lists ?? []).map((name) => [name, []])) }, $pull: { completedSteps: step.id } },
      { new: true, lean: true },
    );
    const listing = draft.submittedAt ? await publishListing(company, draftShape(draft)) : null;
    res.json({ message: listing ? "Step cleared. Your live listing has been updated." : "Step cleared.", data: draftShape(draft), listing });
  } catch (error) { next(error); }
}

/**
 * DELETE / — removes the company's listing from the directory together with everything the
 * wizard saved. Business-profile sections (team, blogs, projects, ...) are kept, so re-adding
 * the listing later picks them up again.
 */
export async function deleteCompanyOnboarding(req, res, next) {
  try {
    const company = req.auth.sub;
    const [listing] = await Promise.all([
      CompanyListing.findOneAndDelete({ company }),
      ...[CompanyOnboardingDraft, CompanyProfile, CompanyBranding, CompanyContact, CompanyLocations, CompanyOperations].map((model) => model.deleteOne({ company })),
    ]);
    res.json({ message: listing ? "Your company listing has been deleted." : "There was no listing to delete.", data: { deleted: Boolean(listing) } });
  } catch (error) { next(error); }
}
