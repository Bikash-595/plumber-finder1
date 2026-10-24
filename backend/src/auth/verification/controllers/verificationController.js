import { accountTypes } from "../../accountTypes.js";
import { sendAuthResponse } from "../../shared/services/authResponse.js";
import { emailAuthConfig } from "../../email/config/emailAuthConfig.js";
import { consumeCode, issueCode } from "../services/emailCodes.js";

const byType = Object.fromEntries(accountTypes.map((account) => [account.accountType, account]));
const cleanEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");
const badRequest = (res, message) => res.status(400).json({ message });

/** POST /api/auth/verify-email { email, accountType, code } — confirms the email and logs the account in. */
export async function verifyEmail(req, res, next) {
  try {
    const email = cleanEmail(req.body?.email);
    const account = byType[req.body?.accountType];
    if (!email || !account) return badRequest(res, "email and accountType are required.");
    const record = await account.Model.findOne({ email });
    if (!record) return badRequest(res, "This code has expired. Request a new one.");
    if (record.emailVerified !== false) return sendAuthResponse(res, record); // already confirmed
    const result = await consumeCode({ email, accountType: account.accountType, purpose: "verify-email", code: req.body?.code });
    if (!result.ok) return badRequest(res, result.message);
    record.emailVerified = true;
    await record.save();
    sendAuthResponse(res, record);
  } catch (error) { next(error); }
}

/** POST /api/auth/resend-code { email, accountType } — a new email-confirmation code. */
export async function resendCode(req, res, next) {
  try {
    const email = cleanEmail(req.body?.email);
    const account = byType[req.body?.accountType];
    if (!email || !account) return badRequest(res, "email and accountType are required.");
    const record = await account.Model.findOne({ email }).select("emailVerified").lean();
    // Same answer whether or not the account exists, so emails can't be probed.
    if (record?.emailVerified === false) await issueCode({ email, accountType: account.accountType, purpose: "verify-email" });
    res.json({ message: `If ${email} is waiting for confirmation, a new code is on its way.` });
  } catch (error) { next(error); }
}

/** POST /api/auth/password/forgot { email, accountType } — emails a reset code if that account has a password. */
export async function forgotPassword(req, res, next) {
  try {
    const email = cleanEmail(req.body?.email);
    const account = byType[req.body?.accountType];
    if (!email || !account) return badRequest(res, "email and accountType are required.");
    const record = await account.Model.findOne({ email }).select("_id").lean();
    if (record) await issueCode({ email, accountType: account.accountType, purpose: "reset-password" });
    res.json({ message: `If there is an account for ${email}, we sent it a 6-digit reset code.` });
  } catch (error) { next(error); }
}

/** POST /api/auth/password/reset { email, accountType, code, password } — sets a new password and logs in. */
export async function resetPassword(req, res, next) {
  try {
    const email = cleanEmail(req.body?.email);
    const account = byType[req.body?.accountType];
    const { password } = req.body ?? {};
    if (!email || !account) return badRequest(res, "email and accountType are required.");
    if (typeof password !== "string" || password.length < emailAuthConfig.passwordMinLength) return badRequest(res, `Password must be at least ${emailAuthConfig.passwordMinLength} characters.`);
    if (Buffer.byteLength(password) > emailAuthConfig.passwordMaxBytes) return badRequest(res, `Password must be at most ${emailAuthConfig.passwordMaxBytes} bytes.`);
    const record = await account.Model.findOne({ email });
    if (!record) return badRequest(res, "This code has expired. Request a new one.");
    const result = await consumeCode({ email, accountType: account.accountType, purpose: "reset-password", code: req.body?.code });
    if (!result.ok) return badRequest(res, result.message);
    record.password = password;
    record.emailVerified = true; // the code proved they own the inbox
    await record.save();
    sendAuthResponse(res, record);
  } catch (error) { next(error); }
}
