import { createSingletonController } from "../../shared/createSingletonController.js";
import { bookingConfig } from "../config/bookingConfig.js";
import { CompanyBookingSettings } from "../models/CompanyBookingSettings.js";

export const bookingController = createSingletonController({ Model: CompanyBookingSettings, config: bookingConfig });
