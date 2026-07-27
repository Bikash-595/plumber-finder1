import { createAccessToken } from "../config/auth.js";
import { Company } from "../company/models/Company.js";
import { Freelancer } from "../freelancer/models/Freelancer.js";
import { User } from "../user/models/User.js";

function publicAccount(account) {
  const result = account.toObject();
  delete result.password;
  return result;
}

export async function loginWithEmail(req, res, next) {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const accounts = await Promise.all([
      User.findOne({ email: normalizedEmail }).select("+password"),
      Company.findOne({ email: normalizedEmail }).select("+password"),
      Freelancer.findOne({ email: normalizedEmail }).select("+password"),
    ]);
    const matchingAccount = (await Promise.all(accounts.filter(Boolean).map(async (account) => (
      account.password && await account.comparePassword(password) ? account : null
    )))).find(Boolean);

    if (!matchingAccount) {
      const isGoogleAccount = accounts.some((account) => account && !account.password);
      return res.status(401).json({
        message: isGoogleAccount ? "This account uses Google sign-in. Please continue with Google." : "Email or password is incorrect.",
      });
    }

    res.json({ token: createAccessToken(matchingAccount), account: publicAccount(matchingAccount) });
  } catch (error) {
    next(error);
  }
}
