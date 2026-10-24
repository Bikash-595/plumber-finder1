import { sendAuthResponse, socialOnlyMessage } from "../../shared/services/authResponse.js";
import { pickProfile } from "../../shared/services/socialAccounts.js";
import { isEmailVerificationRequired } from "../../verification/config/verificationConfig.js";
import { issueCode } from "../../verification/services/emailCodes.js";
import { emailDeliverabilityProblem } from "../../verification/services/emailDeliverability.js";

const INVALID_CREDENTIALS = "Email or password is incorrect.";

/** "Check your email" response: no token until the emailed code is entered at POST /api/auth/verify-email. */
export function sendVerificationRequired(res, account, status = 403) {
  res.status(status).json({
    verificationRequired: true,
    email: account.email,
    accountType: account.accountType,
    message: `We sent a 6-digit code to ${account.email}. Enter it to confirm your email.`,
  });
}

/** Email + password signup and login for one account type. Inputs are checked by validateEmailAuth. */
export function createEmailAuthController({ Model, accountType, nameField, profileFields = [] }) {
  return {
    signup: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const problem = await emailDeliverabilityProblem(email);
        if (problem) return res.status(400).json({ message: problem, field: "email" });
        const verify = isEmailVerificationRequired();
        const details = { ...pickProfile(profileFields, req.body), [nameField]: req.body[nameField], password };

        const existing = await Model.findOne({ email });
        if (existing && existing.emailVerified !== false) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
        // Someone started signing up with this email but never confirmed it: start again with the new details.
        const account = existing ? Object.assign(existing, details) : new Model({ ...details, email, role: accountType, accountType, emailVerified: !verify });
        await account.save();

        if (!verify) return sendAuthResponse(res, account, 201);
        await issueCode({ email, accountType, purpose: "verify-email", quiet: Boolean(existing) });
        sendVerificationRequired(res, account, 201);
      } catch (error) { next(error); }
    },

    login: async (req, res, next) => {
      try {
        const account = await Model.findOne({ email: req.body.email }).select("+password");
        // Same message whether the email or the password is wrong, so emails cannot be probed.
        if (!account) return res.status(401).json({ message: INVALID_CREDENTIALS });
        if (!account.password) return res.status(400).json({ message: socialOnlyMessage(account) });
        if (!(await account.comparePassword(req.body.password))) return res.status(401).json({ message: INVALID_CREDENTIALS });
        if (account.emailVerified === false && isEmailVerificationRequired()) {
          await issueCode({ email: account.email, accountType, purpose: "verify-email", quiet: true });
          return sendVerificationRequired(res, account);
        }
        sendAuthResponse(res, account);
      } catch (error) { next(error); }
    },
  };
}
