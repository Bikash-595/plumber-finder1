import { createAccountController } from "../../shared/controllers/createAccountController.js";
import { userAuthConfig } from "../config/userAuthConfig.js";
import { User } from "../models/User.js";

// Everything the shared sign-in methods need to know about user accounts.
export const userAccount = { Model: User, ...userAuthConfig };

export const userAuthController = createAccountController(userAccount);
