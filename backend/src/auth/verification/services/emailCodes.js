import crypto from "node:crypto";
import { verificationConfig } from "../config/verificationConfig.js";
import { EmailCode } from "../models/EmailCode.js";
import { sendMail } from "./mailer.js";

const { codeLength, codeTtlMinutes, maxAttempts, resendCooldownSeconds, maxSendsPerHour } = verificationConfig;
const hash = (code) => crypto.createHash("sha256").update(code).digest("hex");
const newCode = () => String(crypto.randomInt(0, 10 ** codeLength)).padStart(codeLength, "0");

const subjects = {
  "verify-email": "Your Plumber Finder verification code",
  "reset-password": "Your Plumber Finder password reset code",
};
const intros = {
  "verify-email": "Use this code to confirm your email address and finish creating your Plumber Finder account:",
  "reset-password": "Use this code to reset your Plumber Finder password:",
};

export class CodeLimitError extends Error {
  constructor(message, retryAfterSeconds) { super(message); this.status = 429; this.expose = true; this.retryAfterSeconds = retryAfterSeconds; }
}

/**
 * Creates (or replaces) the code for email + accountType + purpose and emails it.
 * `quiet` skips the cooldown error (used when login re-sends automatically).
 */
export async function issueCode({ email, accountType, purpose, quiet = false }) {
  const now = new Date();
  const existing = await EmailCode.findOne({ email, accountType, purpose });
  if (existing) {
    const waited = (now - existing.lastSentAt) / 1000;
    if (waited < resendCooldownSeconds) {
      if (quiet) return { sent: false, retryAfterSeconds: Math.ceil(resendCooldownSeconds - waited) };
      throw new CodeLimitError(`Please wait ${Math.ceil(resendCooldownSeconds - waited)} seconds before requesting another code.`, Math.ceil(resendCooldownSeconds - waited));
    }
    const sameWindow = now - existing.windowStart < 3600_000;
    if (sameWindow && existing.sendCount >= maxSendsPerHour) {
      if (quiet) return { sent: false };
      throw new CodeLimitError("Too many codes requested for this email. Please try again in an hour.");
    }
  }
  const code = newCode();
  const sameWindow = existing && now - existing.windowStart < 3600_000;
  await EmailCode.findOneAndUpdate(
    { email, accountType, purpose },
    { $set: { codeHash: hash(code), expiresAt: new Date(now.getTime() + codeTtlMinutes * 60_000), attempts: 0, lastSentAt: now, sendCount: sameWindow ? existing.sendCount + 1 : 1, windowStart: sameWindow ? existing.windowStart : now } },
    { upsert: true }
  );
  const text = `${intros[purpose]}\n\n${code}\n\nThe code expires in ${codeTtlMinutes} minutes. If you didn't ask for it, you can ignore this email.`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#0b1f3b"><h2 style="margin:0 0 12px">Plumber Finder</h2><p>${intros[purpose]}</p><p style="font-size:32px;font-weight:700;letter-spacing:8px;background:#FFF7CC;padding:16px;text-align:center;border-radius:12px">${code}</p><p style="color:#555">The code expires in ${codeTtlMinutes} minutes. If you didn't ask for it, you can ignore this email.</p></div>`;
  await sendMail({ to: email, subject: subjects[purpose], text, html });
  return { sent: true };
}

/** Checks a code. A correct code is used up; wrong guesses are counted and the code is discarded after too many. */
export async function consumeCode({ email, accountType, purpose, code }) {
  const record = await EmailCode.findOne({ email, accountType, purpose });
  if (!record || record.expiresAt < new Date()) return { ok: false, message: "This code has expired. Request a new one." };
  if (record.attempts >= maxAttempts) return { ok: false, message: "Too many wrong attempts. Request a new code." };
  const given = Buffer.from(hash(String(code ?? "").trim()));
  const expected = Buffer.from(record.codeHash);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    record.attempts += 1;
    await record.save();
    const left = maxAttempts - record.attempts;
    return { ok: false, message: left > 0 ? `That code is incorrect. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many wrong attempts. Request a new code." };
  }
  await record.deleteOne();
  return { ok: true };
}
