import { createValidator } from "../../shared/createValidator.js";
import { bookingConfig } from "../config/bookingConfig.js";

export const validateBooking = createValidator(bookingConfig);
