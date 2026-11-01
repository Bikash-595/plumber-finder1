import type { JobStage } from "../operationsApi";
import type { Tone } from "@/components/dashboard/ui/tones";

// Board columns in the order work moves through them.
export const jobStages: { key: JobStage; label: string; tone: Tone; hint: string }[] = [
  { key: "scheduled", label: "Scheduled", tone: "info", hint: "Accepted, not started" },
  { key: "in_progress", label: "In progress", tone: "violet", hint: "On site now" },
  { key: "awaiting_confirmation", label: "Waiting for customer", tone: "warning", hint: "Marked done, customer to confirm" },
  { key: "disputed", label: "Disputed", tone: "danger", hint: "Customer reported a problem" },
  { key: "completed", label: "Completed", tone: "success", hint: "Confirmed" },
];
export const stageLabel: Record<string, string> = { scheduled: "Scheduled", in_progress: "In progress", awaiting_confirmation: "Waiting for customer", disputed: "Disputed", completed: "Completed", cancelled: "Cancelled" };
