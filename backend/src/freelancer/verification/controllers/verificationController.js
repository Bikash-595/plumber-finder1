import { createSingletonController } from "../../shared/createSingletonController.js";
import { verificationConfig } from "../config/verificationConfig.js";
import { FreelancerVerification } from "../models/FreelancerVerification.js";

export const verificationController = createSingletonController({ Model: FreelancerVerification, config: verificationConfig });
