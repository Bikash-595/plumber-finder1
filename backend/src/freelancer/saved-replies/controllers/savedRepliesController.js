import { createCollectionController } from "../../shared/createCollectionController.js";
import { savedRepliesConfig } from "../config/savedRepliesConfig.js";
import { FreelancerSavedReply } from "../models/FreelancerSavedReply.js";

export const savedRepliesController = createCollectionController({ Model: FreelancerSavedReply, config: savedRepliesConfig });
