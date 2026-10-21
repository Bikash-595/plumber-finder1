import { createCollectionController as createProfileCollectionController } from "../../shared/profileSections/createCollectionController.js";

/** Customer lists (saved, compare, cart, payment methods). Owner field: `user`; nothing is public. */
export const createCollectionController = (options) =>
  createProfileCollectionController({ ...options, ownerField: "user", resolvePublishedOwner: async () => null });
