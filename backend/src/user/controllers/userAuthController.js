import { createAuthController } from "../../controllers/createAuthController.js";
import { userAuthConfig } from "../config/authConfig.js";
import { User } from "../models/User.js";

export const userAuthController = createAuthController({ Model: User, ...userAuthConfig });
