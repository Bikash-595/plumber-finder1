import { createCollectionController as createProfileCollectionController } from "../../shared/profileSections/createCollectionController.js";
import { resolvePublishedCompany } from "./publishedCompany.js";

/** Company sections with a list of items per company (owner field: `company`). */
export const createCollectionController = (options) =>
  createProfileCollectionController({ ...options, ownerField: "company", resolvePublishedOwner: resolvePublishedCompany });
