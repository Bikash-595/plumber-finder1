import { createSingletonController as createProfileSingletonController } from "../../shared/profileSections/createSingletonController.js";
import { resolvePublishedCompany } from "./publishedCompany.js";

/** Company sections with one document per company (owner field: `company`). */
export const createSingletonController = (options) =>
  createProfileSingletonController({ ...options, ownerField: "company", resolvePublishedOwner: resolvePublishedCompany });
