import { createSingletonController } from "../../shared/createSingletonController.js";
import { verificationConfig } from "../config/verificationConfig.js";
import { CompanyVerification } from "../models/CompanyVerification.js";

export const verificationController = createSingletonController({ Model: CompanyVerification, config: verificationConfig });
