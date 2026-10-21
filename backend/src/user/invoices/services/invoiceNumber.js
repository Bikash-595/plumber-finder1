import { randomBytes } from "node:crypto";

/** e.g. INV-20261021-4F9A2C (date + random suffix; the model enforces uniqueness). */
export function newInvoiceNumber(date = new Date()) {
  return `INV-${date.toISOString().slice(0, 10).replace(/-/g, "")}-${randomBytes(3).toString("hex").toUpperCase()}`;
}
