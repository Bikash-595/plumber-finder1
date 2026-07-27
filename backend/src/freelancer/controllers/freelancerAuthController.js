import { createAuthController } from "../../controllers/createAuthController.js";
import { freelancerAuthConfig } from "../config/authConfig.js";
import { Freelancer } from "../models/Freelancer.js";

export const freelancerAuthController = createAuthController({ Model: Freelancer, ...freelancerAuthConfig });
