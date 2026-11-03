import { sideOf } from "../../../shared/business/sides.js";
import { LoginEvent } from "../../../auth/shared/models/LoginEvent.js";
import { revokeSessions } from "../../../auth/shared/services/sessions.js";
import { createAccessToken } from "../../../auth/shared/services/tokens.js";
import { notifyProvider } from "../../../shared/notifications/AccountNotification.js";
import { passwordProblem } from "../config/settingsConfig.js";
import { EMAIL_PREFERENCES } from "../models/CompanySettings.js";

// Companies and freelancers share these settings; the side (account and settings models) comes from the token.
const preferencesOf = (doc) => Object.fromEntries(EMAIL_PREFERENCES.map((key) => [key, doc?.[key] ?? true]));

async function snapshot(side, accountId) {
  const [account, settings, logins] = await Promise.all([
    side.Account.findById(accountId).select(`+password email phone emailVerified googleId appleId createdAt passwordChangedAt ${side.accountFields}`).lean(),
    side.Settings.findOne({ [side.ownerField]: accountId }).lean(),
    LoginEvent.find({ accountType: side.type, account: accountId }).sort({ createdAt: -1 }).limit(10).select("method ip userAgent createdAt").lean(),
  ]);
  if (!account) return null;
  const view = side.accountView(account);
  return {
    account: {
      companyName: view.name, email: account.email, phone: account.phone ?? "", emailVerified: view.emailVerified,
      status: view.status, createdAt: account.createdAt,
    },
    preferences: preferencesOf(settings),
    security: {
      hasPassword: Boolean(account.password), googleLinked: Boolean(account.googleId), appleLinked: Boolean(account.appleId),
      passwordChangedAt: account.passwordChangedAt ?? null, recentLogins: logins,
    },
  };
}

export const settingsController = {
  // GET / — account, email preferences, sign-in methods and recent sign-ins.
  get: async (req, res, next) => {
    try {
      const data = await snapshot(sideOf(req), req.auth.sub);
      if (!data) return res.status(404).json({ message: "Account not found." });
      res.json({ data });
    } catch (error) { next(error); }
  },

  // PUT /preferences { emailNewBooking?, emailBookingUpdates?, emailNewReview? }
  savePreferences: async (req, res, next) => {
    try {
      const side = sideOf(req);
      const doc = await side.Settings.findOneAndUpdate({ [side.ownerField]: req.auth.sub }, { $set: req.validated }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
      res.json({ message: "Notification settings saved.", data: preferencesOf(doc) });
    } catch (error) { next(error); }
  },

  // PUT /account { phone } — the account's contact phone (the public listing has its own on the profile).
  saveAccount: async (req, res, next) => {
    try {
      const side = sideOf(req);
      await side.Account.updateOne({ _id: req.auth.sub }, req.validated.phone ? { $set: { phone: req.validated.phone } } : { $unset: { phone: 1 } });
      res.json({ message: "Account details saved.", data: (await snapshot(side, req.auth.sub)).account });
    } catch (error) { next(error); }
  },

  // POST /password { currentPassword?, newPassword } — ends every other session; returns a fresh token for this one.
  changePassword: async (req, res, next) => {
    try {
      const side = sideOf(req);
      const account = await side.Account.findById(req.auth.sub).select("+password email");
      if (!account) return res.status(404).json({ message: "Account not found." });
      const { currentPassword, newPassword } = req.validated;
      if (account.password && !(currentPassword && await account.comparePassword(currentPassword))) {
        return res.status(400).json({ message: "Your current password is incorrect.", errors: { currentPassword: "is incorrect" } });
      }
      const problem = passwordProblem(newPassword, account.email);
      if (problem) return res.status(400).json({ message: problem, errors: { newPassword: problem } });
      if (account.password && await account.comparePassword(newPassword)) return res.status(400).json({ message: "Choose a password you haven't used here before." });
      account.password = newPassword;
      account.passwordChangedAt = new Date();
      await account.save();
      const updated = await revokeSessions(side.type, account._id);
      await notifyProvider(side.type, account._id, { type: "system", title: "Your password was changed", message: "If this wasn't you, reset your password and contact Plumber Finder support.", link: `${side.dashboard}/settings` });
      res.json({ message: "Password updated. Other devices have been signed out.", data: { token: createAccessToken(updated) } });
    } catch (error) { next(error); }
  },

  // POST /sign-out-everywhere — ends every session, including stolen ones; this device gets a fresh token.
  signOutEverywhere: async (req, res, next) => {
    try {
      const updated = await revokeSessions(sideOf(req).type, req.auth.sub);
      res.json({ message: "Signed out of every other device.", data: { token: createAccessToken(updated) } });
    } catch (error) { next(error); }
  },
};
