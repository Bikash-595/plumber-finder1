import { createValidator } from "../../shared/createValidator.js";
import { addressesConfig } from "../config/addressesConfig.js";

export const validateAddressCreate = createValidator(addressesConfig);
export const validateAddressUpdate = createValidator(addressesConfig, { partial: true });
