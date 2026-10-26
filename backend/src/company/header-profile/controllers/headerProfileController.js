import { Company } from "../../../auth/company/models/Company.js";
import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { listingSlugUpdate } from "../../listing/services/listingSlug.js";
import { CompanyOnboardingDraft } from "../../onboarding/models/CompanyOnboardingDraft.js";
import { CompanyServiceArea } from "../../service-areas/models/CompanyServiceArea.js";
import { CompanyServiceOffering } from "../../services/models/CompanyServiceOffering.js";
import { syncFirstCoverImage } from "../../../shared/profileSections/coverImages.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { headerProfileConfig } from "../config/headerProfileConfig.js";
import { CompanyHeaderProfile } from "../models/CompanyHeaderProfile.js";

/**
 * Keeps the public listing (name, tagline, bio, logo, cover, URL slug) in step with the header profile, and
 * creates the listing if the company hasn't published through the Add Company wizard, so every
 * company that fills in its profile gets a public page at /company/<slug>.
 */
async function syncListing(profile, { company }) {
  const [slugFields, account, services, serviceArea, draft] = await Promise.all([
    listingSlugUpdate(company, profile.companyName),
    Company.findById(company).select("status email").lean(),
    CompanyServiceOffering.find({ company }).sort({ position: 1, createdAt: 1 }).select("name").lean(),
    CompanyServiceArea.findOne({ company }).select("areas").lean(),
    CompanyOnboardingDraft.findOne({ company, submittedAt: { $ne: null } }).select("formData.tagline formData.shortDescription").lean(),
  ]);
  await CompanyListing.findOneAndUpdate(
    { company },
    {
      $set: {
        companyName: profile.companyName, ...slugFields,
        // The header's tagline and bio win; cleared ones fall back to the Add Company wizard's answers.
        tagline: profile.tagline || draft?.formData?.tagline || null,
        description: profile.bio || draft?.formData?.shortDescription || null,
        ...(profile.logo ? { logo: profile.logo } : {}), ...(profile.coverImage ? { coverImage: profile.coverImage } : {}),
      },
      // Suspended companies stay hidden.
      $setOnInsert: { company, isPublished: account?.status !== "suspended", email: account?.email, services: services.map((service) => service.name), serviceAreas: serviceArea?.areas ?? [] },
    },
    { upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

/** Deleting the profile removes a listing that only the profile created; a wizard listing stays (with its own name). */
async function afterDelete({ company }) {
  const wizard = await CompanyOnboardingDraft.exists({ company, submittedAt: { $ne: null } });
  if (!wizard) await CompanyListing.deleteOne({ company });
}

export const headerProfileController = createSingletonController({
  Model: CompanyHeaderProfile,
  config: headerProfileConfig,
  beforeSave: syncFirstCoverImage,
  afterSave: syncListing,
  afterDelete,
});
