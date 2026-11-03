import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { contactConfig } from "../config/contactConfig.js";
import { CompanyContact } from "../models/CompanyContact.js";

// The listing's phone, email and website are what cards and the profile header show.
const syncListing = (company, doc) => CompanyListing.updateOne({ company }, { $set: { phone: doc?.primaryPhone ?? null, email: doc?.email ?? null, website: doc?.website ?? null } });

export const contactController = createSingletonController({
  Model: CompanyContact,
  config: contactConfig,
  afterSave: (doc, { company }) => syncListing(company, doc),
  afterDelete: ({ company }) => syncListing(company, null),
});
