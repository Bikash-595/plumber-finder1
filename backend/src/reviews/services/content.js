import { CustomerReview } from "../models/index.js";

const HOLD_WORDS = /\b(viagra|casino|crypto|bitcoin|loan offer|click here|whatsapp me|telegram)\b/i;
const ABUSE = /\b(fuck|shit|bitch|bastard|cunt|retard)\w*/i;

/** Checks a review's text. Returns { error } to refuse it, { hold } to publish only after moderation, or {}. */
export function checkContent({ title, body }) {
  if (title !== undefined && title !== null && title.trim().length > 0 && title.trim().length < 3) return { error: "Give your review a short title (at least 3 characters) or leave it empty." };
  if (body !== undefined && body.trim().length < 20) return { error: "Tell other customers a little more (at least 20 characters)." };
  const text = `${title ?? ""} ${body ?? ""}`;
  if ((text.match(/https?:\/\/|www\./gi) ?? []).length > 0) return { hold: "Contains a link" };
  if (HOLD_WORDS.test(text)) return { hold: "Possible spam words" };
  if (ABUSE.test(text)) return { hold: "Possible abusive language" };
  if (/(.)\1{9,}/.test(text)) return { hold: "Repeated characters" };
  return {};
}

/** Same text already posted by a different customer — a common sign of fake reviews; held for a moderator. */
export async function duplicateFromOthers(user, body) {
  return Boolean(await CustomerReview.exists({ body: body.trim(), user: { $ne: user } }));
}
