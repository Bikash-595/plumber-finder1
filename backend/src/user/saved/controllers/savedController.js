import { createCollectionController } from "../../shared/createCollectionController.js";
import { savedConfig } from "../config/savedConfig.js";
import { UserSavedItem } from "../models/UserSavedItem.js";

export const savedController = createCollectionController({ Model: UserSavedItem, config: savedConfig });

/** Express middleware: friendly 409 instead of a duplicate-key error when the plumber is already listed. */
export async function rejectSavedDuplicate(req, res, next) {
  try {
    const { providerType, providerId } = req.validated;
    if (await UserSavedItem.exists({ user: req.auth.sub, providerType, providerId })) {
      return res.status(409).json({ message: "This plumber is already in your list." });
    }
    next();
  } catch (error) { next(error); }
}

/** DELETE /provider/:providerType/:providerId — remove a plumber without knowing the item id (toggle buttons). */
export async function removeSavedByProvider(req, res, next) {
  try {
    const doc = await UserSavedItem.findOneAndDelete({ user: req.auth.sub, providerType: req.params.providerType, providerId: req.params.providerId });
    if (!doc) return res.status(404).json({ message: "This plumber is not in your list." });
    res.json({ message: "Removed.", data: { _id: doc._id } });
  } catch (error) { next(error); }
}
