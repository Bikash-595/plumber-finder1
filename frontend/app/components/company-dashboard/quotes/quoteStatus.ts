import type { Tone } from "@/components/dashboard/ui/tones";
import type { QuoteStatus } from "../growthApi";

export const quoteStatus: Record<QuoteStatus, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "neutral" },
  sent: { label: "Waiting for customer", tone: "warning" },
  accepted: { label: "Accepted", tone: "success" },
  declined: { label: "Declined", tone: "danger" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
  expired: { label: "Expired", tone: "neutral" },
};
