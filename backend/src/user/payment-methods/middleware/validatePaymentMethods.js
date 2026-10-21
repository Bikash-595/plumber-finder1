import { createValidator } from "../../shared/createValidator.js";
import { paymentMethodsConfig } from "../config/paymentMethodsConfig.js";

export const validatePaymentMethodCreate = createValidator(paymentMethodsConfig);
export const validatePaymentMethodUpdate = createValidator(paymentMethodsConfig, { partial: true });
