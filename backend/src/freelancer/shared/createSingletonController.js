import { createSingletonController as createProfileSingletonController } from "../../shared/profileSections/createSingletonController.js";
import { resolvePublishedFreelancer } from "./publishedFreelancer.js";

/** Freelancer sections with one document per freelancer (owner field: `freelancer`). */
export const createSingletonController = (options) =>
  createProfileSingletonController({ ...options, ownerField: "freelancer", resolvePublishedOwner: resolvePublishedFreelancer });
