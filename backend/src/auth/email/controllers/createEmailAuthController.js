import { sendAuthResponse, socialOnlyMessage } from "../../shared/services/authResponse.js";
import { pickProfile } from "../../shared/services/socialAccounts.js";

const INVALID_CREDENTIALS = "Email or password is incorrect.";

/** Email + password signup and login for one account type. Inputs are checked by validateEmailAuth. */
export function createEmailAuthController({ Model, accountType, nameField, profileFields = [] }) {
  return {
    signup: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (await Model.exists({ email })) return res.status(409).json({ message: "An account with this email already exists." });
        const account = await Model.create({ ...pickProfile(profileFields, req.body), [nameField]: req.body[nameField], email, password, role: accountType, accountType });
        sendAuthResponse(res, account, 201);
      } catch (error) { next(error); }
    },

    login: async (req, res, next) => {
      try {
        const account = await Model.findOne({ email: req.body.email }).select("+password");
        // Same message whether the email or the password is wrong, so emails cannot be probed.
        if (!account) return res.status(401).json({ message: INVALID_CREDENTIALS });
        if (!account.password) return res.status(400).json({ message: socialOnlyMessage(account) });
        if (!(await account.comparePassword(req.body.password))) return res.status(401).json({ message: INVALID_CREDENTIALS });
        sendAuthResponse(res, account);
      } catch (error) { next(error); }
    },
  };
}
