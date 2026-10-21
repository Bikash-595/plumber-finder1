import { createCollectionController } from "../../shared/createCollectionController.js";
import { paymentMethodsConfig } from "../config/paymentMethodsConfig.js";
import { UserPaymentMethod } from "../models/UserPaymentMethod.js";

export const paymentMethodsController = createCollectionController({
  Model: UserPaymentMethod,
  config: paymentMethodsConfig,
  // Exactly one default: the first card becomes default, and choosing a new default clears the old one.
  beforeWrite: async (values, { user, id }) => {
    if (!id && !(await UserPaymentMethod.exists({ user }))) values.isDefault = true;
    if (values.isDefault) await UserPaymentMethod.updateMany({ user, isDefault: true, ...(id ? { _id: { $ne: id } } : {}) }, { $set: { isDefault: false } });
  },
});
