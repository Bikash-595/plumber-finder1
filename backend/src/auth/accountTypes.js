import { companyAccount } from "./company/controllers/companyAuthController.js";
import { freelancerAccount } from "./freelancer/controllers/freelancerAuthController.js";
import { userAccount } from "./user/controllers/userAuthController.js";

/** Every account type that can sign in. Used by the unified email login. */
export const accountTypes = [userAccount, companyAccount, freelancerAccount];
