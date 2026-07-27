import { createAccessToken, verifyGoogleCredential } from "../config/auth.js";

function publicAccount(account) {
  const result = account.toObject ? account.toObject() : account;
  delete result.password;
  return result;
}

export function createAuthController({ Model, accountType, nameField }) {
  const respond = (res, account, status = 200) => res.status(status).json({ token: createAccessToken(account), account: publicAccount(account) });

  return {
    signup: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (!email || !password || !req.body[nameField]) return res.status(400).json({ message: `email, password, and ${nameField} are required.` });
        if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
        const normalizedEmail = email.trim().toLowerCase();
        if (await Model.exists({ email: normalizedEmail })) return res.status(409).json({ message: "An account with this email already exists." });
        const account = await Model.create({ ...req.body, email: normalizedEmail, role: accountType, accountType });
        respond(res, account, 201);
      } catch (error) { next(error); }
    },
    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
          return res.status(400).json({ message: "Email and password are required." });
        }
        const account = await Model.findOne({ email: email.trim().toLowerCase() }).select("+password");
        if (!account) return res.status(401).json({ message: "No account was found for this email and account type." });
        if (!account.password) return res.status(400).json({ message: "This account uses Google sign-in. Please continue with Google." });
        if (!(await account.comparePassword(password))) return res.status(401).json({ message: "Incorrect password. Please try again." });
        respond(res, account);
      } catch (error) { next(error); }
    },
    google: async (req, res, next) => {
      try {
        if (!req.body.credential) return res.status(400).json({ message: "Google credential is required." });
        const googleProfile = await verifyGoogleCredential(req.body.credential);
        let account = await Model.findOne({ $or: [{ googleId: googleProfile.googleId }, { email: googleProfile.email }] });
        if (!account) {
          account = await Model.create({ ...req.body, [nameField]: req.body[nameField] || googleProfile.name, email: googleProfile.email, googleId: googleProfile.googleId, avatarUrl: googleProfile.avatarUrl, role: accountType, accountType });
        } else if (!account.googleId) {
          account.googleId = googleProfile.googleId;
          if (!account.avatarUrl && googleProfile.avatarUrl) account.avatarUrl = googleProfile.avatarUrl;
          await account.save();
        }
        respond(res, account, 200);
      } catch (error) { next(error); }
    },
    me: async (req, res, next) => {
      try {
        const account = await Model.findById(req.auth.sub);
        if (!account) return res.status(404).json({ message: "Account not found." });
        res.json({ account: publicAccount(account) });
      } catch (error) { next(error); }
    },
  };
}
