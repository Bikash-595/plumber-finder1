import { createAccountController } from "../../shared/controllers/createAccountController.js";
import { userAuthConfig } from "../config/userAuthConfig.js";
import { User } from "../models/User.js";
import { validateUserLocation } from "../middleware/validateUserLocation.js";

// Everything the shared sign-in methods need to know about user accounts.
// Email signup also checks the ZIP code (Google/Apple signups add it later in the profile).
export const userAccount = { Model: User, ...userAuthConfig, signupMiddleware: [validateUserLocation] };

export const userAuthController = createAccountController(userAccount);
