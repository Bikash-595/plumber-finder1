import { cleanWeeklyHours } from "../../../shared/openingHours.js";
import { createValidator } from "../../shared/createValidator.js";
import { openingHoursConfig } from "../config/openingHoursConfig.js";

const validateFields = createValidator(openingHoursConfig);

/** Validates the text fields, then the weekly rows (sent as `weeklyHours`; an empty list clears them). */
export function validateOpeningHours(req, res, next) {
  validateFields(req, res, () => {
    if (req.body.weeklyHours === undefined) return next();
    const { values, error } = cleanWeeklyHours(req.body.weeklyHours);
    if (error) return res.status(400).json({ message: "Please check the Opening hours details.", errors: { weeklyHours: error } });
    req.validated.weeklyHours = values;
    next();
  });
}
