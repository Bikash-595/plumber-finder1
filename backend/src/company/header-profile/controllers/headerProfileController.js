import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { headerProfileConfig } from "../config/headerProfileConfig.js";
import { CompanyHeaderProfile } from "../models/CompanyHeaderProfile.js";

export const headerProfileController = createSingletonController({
  Model: CompanyHeaderProfile,
  config: headerProfileConfig,
  // Keep the public listing card (name, logo, cover) in step with the header profile.
  afterSave: (profile, { company }) => CompanyListing.updateOne(
    { company },
    { $set: { companyName: profile.companyName, logo: profile.logo ?? undefined, coverImage: profile.coverImage ?? undefined } }
  ),
});
