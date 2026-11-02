import { createCollectionController } from "../../shared/createCollectionController.js";
import { savedRepliesConfig } from "../config/savedRepliesConfig.js";
import { CompanySavedReply } from "../models/CompanySavedReply.js";

export const savedRepliesController = createCollectionController({ Model: CompanySavedReply, config: savedRepliesConfig });
