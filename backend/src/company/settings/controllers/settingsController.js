import { Company } from "../../../auth/company/models/Company.js";
import { LoginEvent } from "../../../auth/shared/models/LoginEvent.js";
import { revokeSessions } from "../../../auth/shared/services/sessions.js";
import { createAccessToken } from "../../../auth/shared/services/tokens.js";
import { notifyProvider } from "../../../shared/notifications/AccountNotification.js";
import { passwordProblem } from "../config/settingsConfig.js";
import { CompanySettings, EMAIL_PREFERENCES } from "../models/CompanySettings.js";

const preferencesOf = (doc) => Object.fromEntries(EMAIL_PREFERENCES.map((key) => [key, doc?.[key] ?? true]));

async function snapshot(companyId) {
  const [company, settings, logins] = await Promise.all([
    Company.findById(companyId).select("+password companyName email phone emailVerified status googleId appleId createdAt passwordChangedAt").lean(),
    CompanySettings.findOne({ company: companyId }).lean(),
    LoginEvent.find({ accountType: "company", account: companyId }).sort({ createdAt: -1 }).limit(10).select("method ip userAgent createdAt").lean(),
  ]);
  if (!company) return null;
  return {
    account: {
      companyName: company.companyName, email: company.email, phone: company.phone ?? "", emailVerified: company.emailVerified !== false,
      status: company.status, createdAt: company.createdAt,
    },
    preferences: preferencesOf(settings),
    security: {
      hasPassword: Boolean(company.password), googleLinked: Boolean(company.googleId), appleLinked: Boolean(company.appleId),
      passwordChangedAt: company.passwordChangedAt ?? null, recentLogins: logins,
    },
  };
}

export const settingsController = {
  // GET / — account, email preferences, sign-in methods and recent sign-ins.
  get: async (req, res, next) => {
    try {
      const data = await snapshot(req.auth.sub);
      if (!data) return res.status(404).json({ message: "Account not found." });
      res.json({ data });
    } catch (error) { next(error); }
  },

  // PUT /preferences { emailNewBooking?, emailBookingUpdates?, emailNewReview? }
  savePreferences: async (req, res, next) => {
    try {
      const doc = await CompanySettings.findOneAndUpdate({ company: req.auth.sub }, { $set: req.validated }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
      res.json({ message: "Notification settings saved.", data: preferencesOf(doc) });
    } catch (error) { next(error); }
  },

  // PUT /account { phone } — the account's contact phone (the public listing has its own on the profile).
  saveAccount: async (req, res, next) => {
    try {
      await Company.updateOne({ _id: req.auth.sub }, req.validated.phone ? { $set: { phone: req.validated.phone } } : { $unset: { phone: 1 } });
      res.json({ message: "Account details saved.", data: (await snapshot(req.auth.sub)).account });
    } catch (error) { next(error); }
  },

  // POST /password { currentPassword?, newPassword } — ends every other session; returns a fresh token for this one.
  changePassword: async (req, res, next) => {
    try {
      const company = await Company.findById(req.auth.sub).select("+password email");
      if (!company) return res.status(404).json({ message: "Account not found." });
      const { currentPassword, newPassword } = req.validated;
      if (company.password && !(currentPassword && await company.comparePassword(currentPassword))) {
        return res.status(400).json({ message: "Your current password is incorrect.", errors: { currentPassword: "is incorrect" } });
      }
      const problem = passwordProblem(newPassword, company.email);
      if (problem) return res.status(400).json({ message: problem, errors: { newPassword: problem } });
      if (company.password && await company.comparePassword(newPassword)) return res.status(400).json({ message: "Choose a password you haven't used here before." });
      company.password = newPassword;
      company.passwordChangedAt = new Date();
      await company.save();
      const updated = await revokeSessions("company", company._id);
      await notifyProvider("company", company._id, { type: "system", title: "Your password was changed", message: "If this wasn't you, reset your password and contact Plumber Finder support.", link: "/company-dashboard/settings" });
      res.json({ message: "Password updated. Other devices have been signed out.", data: { token: createAccessToken(updated) } });
    } catch (error) { next(error); }
  },

  // POST /sign-out-everywhere — ends every session, including stolen ones; this device gets a fresh token.
  signOutEverywhere: async (req, res, next) => {
    try {
      const updated = await revokeSessions("company", req.auth.sub);
      res.json({ message: "Signed out of every other device.", data: { token: createAccessToken(updated) } });
    } catch (error) { next(error); }
  },
};
