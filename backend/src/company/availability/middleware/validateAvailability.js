import { createValidator } from "../../shared/createValidator.js";
import { availabilityConfig } from "../config/availabilityConfig.js";

export const validateAvailability = createValidator({
  ...availabilityConfig,
  // Each day-off period must end on or after its start.
  validate: ({ timeOff }) => (timeOff?.some((p) => p.end < p.start) ? { timeOff: "each period must end on or after its start" } : null),
}, { partial: true });
