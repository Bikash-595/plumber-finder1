import { createSingletonController } from "../../shared/createSingletonController.js";
import { bookingConfig } from "../config/bookingConfig.js";
import { FreelancerBookingSettings } from "../models/FreelancerBookingSettings.js";

export const bookingController = createSingletonController({ Model: FreelancerBookingSettings, config: bookingConfig });
