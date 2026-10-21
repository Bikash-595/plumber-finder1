import { sendAuthResponse } from "../../shared/services/authResponse.js";
import { findOrCreateSocialAccount } from "../../shared/services/socialAccounts.js";
import { verifyAppleIdentityToken } from "../services/verifyAppleIdentityToken.js";

/** Sign in with Apple for one account type. */
export function createAppleAuthController(account) {
  return {
    apple: async (req, res, next) => {
      try {
        const identity = await verifyAppleIdentityToken(req.body.identityToken, { nonce: req.body.nonce });
        const { account: signedIn, created } = await findOrCreateSocialAccount(account, { ...identity, name: req.body.name }, req.body);
        sendAuthResponse(res, signedIn, created ? 201 : 200);
      } catch (error) { next(error); }
    },
  };
}
