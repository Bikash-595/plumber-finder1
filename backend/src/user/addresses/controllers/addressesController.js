import { User } from "../../../auth/user/models/User.js";
import { createCollectionController } from "../../shared/createCollectionController.js";
import { addressesConfig, formatAddress } from "../config/addressesConfig.js";
import { UserAddress } from "../models/UserAddress.js";

/**
 * After any change: exactly one default whenever any address exists (the oldest takes over if the
 * default was deleted), and the account's one-line `address` mirrors the default for older screens.
 */
async function syncDefault({ user }) {
  let preferred = await UserAddress.findOne({ user, isDefault: true }).lean();
  if (!preferred) {
    preferred = await UserAddress.findOneAndUpdate({ user }, { $set: { isDefault: true } }, { sort: { position: 1, createdAt: 1 }, new: true }).lean();
  }
  await User.updateOne({ _id: user }, preferred ? { $set: { address: formatAddress(preferred) } } : { $unset: { address: 1 } });
}

export const addressesController = createCollectionController({
  Model: UserAddress,
  config: addressesConfig,
  // The first address is the default; choosing a new default clears the old one.
  beforeWrite: async (values, { user, id }) => {
    if (!id && !(await UserAddress.exists({ user }))) values.isDefault = true;
    if (values.isDefault) await UserAddress.updateMany({ user, isDefault: true, ...(id ? { _id: { $ne: id } } : {}) }, { $set: { isDefault: false } });
    if (id && values.isDefault === false && (await UserAddress.exists({ _id: id, user, isDefault: true }))) delete values.isDefault; // keep one default
  },
  afterChange: syncDefault,
});
