import { accountTypes } from "../../accountTypes.js";
import { sendAuthResponse, socialOnlyMessage } from "../../shared/services/authResponse.js";

/**
 * POST /api/auth/login — email + password login that finds the account type itself.
 * The same email may exist as a user, company, and freelancer; the password decides which one.
 */
export async function unifiedLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const accounts = (await Promise.all(accountTypes.map(({ Model }) => Model.findOne({ email }).select("+password")))).filter(Boolean);
    const matches = await Promise.all(accounts.map(async (account) => (account.password && await account.comparePassword(password) ? account : null)));
    const account = matches.find(Boolean);
    if (account) return sendAuthResponse(res, account);

    const socialOnly = accounts.find((candidate) => !candidate.password);
    res.status(401).json({ message: socialOnly && accounts.every((candidate) => !candidate.password) ? socialOnlyMessage(socialOnly) : "Email or password is incorrect." });
  } catch (error) { next(error); }
}
