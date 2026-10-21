import { sendAuthResponse } from "../../shared/services/authResponse.js";
import { findOrCreateSocialAccount } from "../../shared/services/socialAccounts.js";
import { verifyGoogleCredential } from "../services/verifyGoogleCredential.js";

/** Google sign-in / sign-up for one account type. */
export function createGoogleAuthController(account) {
  return {
    google: async (req, res, next) => {
      try {
        const identity = await verifyGoogleCredential(req.body.credential);
        const { account: signedIn, created } = await findOrCreateSocialAccount(account, identity, req.body);
        sendAuthResponse(res, signedIn, created ? 201 : 200);
      } catch (error) { next(error); }
    },
  };
}
