import { FreelancerListing } from "../../listing/models/FreelancerListing.js";
import { FreelancerServiceArea } from "../../service-areas/models/FreelancerServiceArea.js";
import { FreelancerServiceOffering } from "../../services/models/FreelancerServiceOffering.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { headerProfileConfig } from "../config/headerProfileConfig.js";
import { FreelancerHeaderProfile } from "../models/FreelancerHeaderProfile.js";

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Creates or updates the freelancer's public listing from the header profile and the sections. */
async function syncListing(profile, { freelancer }) {
  const [services, serviceArea] = await Promise.all([
    FreelancerServiceOffering.find({ freelancer }).sort({ position: 1, createdAt: 1 }).select("name").lean(),
    FreelancerServiceArea.findOne({ freelancer }).select("areas").lean(),
  ]);
  await FreelancerListing.findOneAndUpdate(
    { freelancer },
    {
      $set: {
        displayName: profile.displayName,
        slug: `${slugify(profile.displayName) || "freelancer"}-${String(freelancer).slice(-6)}`,
        headline: profile.headline ?? null,
        photo: profile.photo ?? null,
        coverImage: profile.coverImage ?? null,
        phone: profile.phone ?? null,
        city: profile.city ?? null,
        state: profile.state ?? null,
        hourlyRate: profile.hourlyRate ?? null,
        yearsExperience: profile.yearsExperience ?? null,
        isAvailable: profile.isAvailable,
        isPublished: profile.published,
        services: services.map((service) => service.name),
        serviceAreas: serviceArea?.areas ?? [],
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

export const headerProfileController = createSingletonController({
  Model: FreelancerHeaderProfile,
  config: headerProfileConfig,
  afterSave: syncListing,
});

/** DELETE — removes the freelancer from the public directory (header profile and listing). Other sections are kept. */
export async function deleteHeaderProfile(req, res, next) {
  try {
    const freelancer = req.auth.sub;
    const [listing] = await Promise.all([FreelancerListing.findOneAndDelete({ freelancer }), FreelancerHeaderProfile.deleteOne({ freelancer })]);
    res.json({ message: listing ? "Your public listing has been deleted." : "There was no listing to delete.", data: { deleted: Boolean(listing) } });
  } catch (error) { next(error); }
}
