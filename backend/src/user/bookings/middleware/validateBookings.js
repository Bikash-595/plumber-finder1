import { createValidator } from "../../shared/createValidator.js";
import { bookingsConfig } from "../config/bookingsConfig.js";

export const validateBookingRequest = createValidator(bookingsConfig);
