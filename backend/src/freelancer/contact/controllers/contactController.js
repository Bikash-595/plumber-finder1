import { FreelancerListing } from "../../listing/models/FreelancerListing.js";
import { createSingletonController } from "../../shared/createSingletonController.js";
import { contactConfig } from "../config/contactConfig.js";
import { FreelancerContact } from "../models/FreelancerContact.js";

// The listing's phone is what cards and the profile header show.
const syncListing = (freelancer, doc) => FreelancerListing.updateOne({ freelancer }, doc?.primaryPhone ? { $set: { phone: doc.primaryPhone } } : { $unset: { phone: 1 } });

export const contactController = createSingletonController({
  Model: FreelancerContact,
  config: contactConfig,
  afterSave: (doc, { freelancer }) => syncListing(freelancer, doc),
  afterDelete: ({ freelancer }) => syncListing(freelancer, null),
});
