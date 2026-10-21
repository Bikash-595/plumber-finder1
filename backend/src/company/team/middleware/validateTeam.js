import { createValidator } from "../../shared/createValidator.js";
import { teamConfig } from "../config/teamConfig.js";

// Create requires every required field; update accepts any subset of fields.
export const validateTeamCreate = createValidator(teamConfig);
export const validateTeamUpdate = createValidator(teamConfig, { partial: true });
