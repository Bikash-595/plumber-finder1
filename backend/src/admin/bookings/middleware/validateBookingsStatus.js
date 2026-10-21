import { createValidator } from "../../../shared/profileSections/createValidator.js";
import { bookingsConfig } from "../config/bookingsConfig.js";

export const validateBookingsStatus = createValidator({ label: "status", fields: bookingsConfig.statusFields });
