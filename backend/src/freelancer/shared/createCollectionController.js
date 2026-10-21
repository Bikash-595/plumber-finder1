import { createCollectionController as createProfileCollectionController } from "../../shared/profileSections/createCollectionController.js";
import { resolvePublishedFreelancer } from "./publishedFreelancer.js";

/** Freelancer sections with a list of items per freelancer (owner field: `freelancer`). */
export const createCollectionController = (options) =>
  createProfileCollectionController({ ...options, ownerField: "freelancer", resolvePublishedOwner: resolvePublishedFreelancer });
