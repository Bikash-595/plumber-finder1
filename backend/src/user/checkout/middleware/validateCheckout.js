import { bookingsConfig } from "../../bookings/config/bookingsConfig.js";
import { createValidator } from "../../shared/createValidator.js";
import { checkoutConfig } from "../config/checkoutConfig.js";

// Same "no past dates" rule as booking requests.
export const validateCheckout = createValidator({ ...checkoutConfig, validate: bookingsConfig.validate });
