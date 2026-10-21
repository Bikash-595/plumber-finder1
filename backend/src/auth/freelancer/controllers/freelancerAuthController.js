import { createAccountController } from "../../shared/controllers/createAccountController.js";
import { freelancerAuthConfig } from "../config/freelancerAuthConfig.js";
import { Freelancer } from "../models/Freelancer.js";

// Everything the shared sign-in methods need to know about freelancer accounts.
export const freelancerAccount = { Model: Freelancer, ...freelancerAuthConfig };

export const freelancerAuthController = createAccountController(freelancerAccount);
