import crypto from "node:crypto";

const cents = (value) => Math.round(value * 100) / 100;

/** Subtotal, discount (never more than the subtotal), tax on the discounted amount, and total. */
export function quoteTotals({ items = [], discount = 0, taxRate = 0 }) {
  const lines = items.map((item) => ({ ...item, amount: cents(item.quantity * item.unitPrice) }));
  const subtotal = cents(lines.reduce((sum, line) => sum + line.amount, 0));
  const off = Math.min(cents(discount ?? 0), subtotal);
  const tax = cents((subtotal - off) * ((taxRate ?? 0) / 100));
  return { items: lines, subtotal, discount: off, taxRate: taxRate ?? 0, tax, total: cents(subtotal - off + tax) };
}

// Q-7F3K2Q (no 0/O/1/I).
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const newQuoteNumber = () => `Q-${Array.from(crypto.randomBytes(6), (byte) => ALPHABET[byte % ALPHABET.length]).join("")}`;

/** A sent quote past its valid-until date counts as expired (it can't be accepted any more). */
export const effectiveStatus = (quote, now = new Date()) => (quote.status === "sent" && quote.validUntil && new Date(quote.validUntil) < now ? "expired" : quote.status);
