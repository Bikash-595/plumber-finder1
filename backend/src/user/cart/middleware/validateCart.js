import { createValidator } from "../../shared/createValidator.js";
import { cartConfig } from "../config/cartConfig.js";

export const validateCartItem = createValidator(cartConfig);
export const validateCartQuantity = createValidator({ label: cartConfig.label, fields: cartConfig.quantityFields });
export const validatePromoCode = createValidator({ label: "promo code", fields: cartConfig.promoFields });
