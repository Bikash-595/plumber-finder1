import { createSingletonController as createProfileSingletonController } from "../../shared/profileSections/createSingletonController.js";

/** Customer single records (settings). Owner field: `user`; nothing is public. */
export const createSingletonController = (options) =>
  createProfileSingletonController({ ...options, ownerField: "user", resolvePublishedOwner: async () => null });
