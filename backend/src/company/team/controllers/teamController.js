import { createCollectionController } from "../../shared/createCollectionController.js";
import { teamConfig } from "../config/teamConfig.js";
import { CompanyTeamMember } from "../models/CompanyTeamMember.js";

export const teamController = createCollectionController({ Model: CompanyTeamMember, config: teamConfig });
