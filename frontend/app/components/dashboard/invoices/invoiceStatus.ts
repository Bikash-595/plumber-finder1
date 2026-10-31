import type { Invoice } from "@/components/utils/userApi";
import type { Tone } from "../ui/tones";

export const invoiceStatus: Record<Invoice["status"], { label: string; tone: Tone }> = {
  pending: { label: "Due", tone: "warning" },
  paid: { label: "Paid", tone: "success" },
  refunded: { label: "Refunded", tone: "info" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

/** The plumbers named on an invoice, e.g. "Ace Plumbing, Fran's Pipes". */
export const invoiceProviders = (invoice: Invoice) => [...new Set(invoice.items.map((item) => item.providerName).filter(Boolean))].join(", ");
