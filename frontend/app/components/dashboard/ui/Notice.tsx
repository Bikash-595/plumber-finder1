import type { ReactNode } from "react";

/** Inline message for errors and confirmations. Errors are announced to screen readers. */
export default function Notice({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: ReactNode }) {
  if (!children) return null;
  const styles = { error: "border-red-200 bg-red-50 text-red-700", success: "border-emerald-200 bg-emerald-50 text-emerald-700", info: "border-blue-200 bg-blue-50 text-blue-800" }[tone];
  return <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${styles}`}>{children}</p>;
}
