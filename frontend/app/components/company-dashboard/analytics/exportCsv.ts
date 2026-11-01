import type { CompanyAnalytics } from "../companyApi";

/** Downloads the period's timeline as a CSV file (opens in Excel or Google Sheets). */
export function exportTimelineCsv(data: CompanyAnalytics) {
  const header = [data.granularity === "day" ? "Date" : "Month", "Profile views", "Booking requests", "Completed jobs", "Revenue (USD)"];
  const rows = data.timeline.map((row) => [row.key, row.views, row.bookings, row.completed, row.revenue.toFixed(2)]);
  const csv = [header, ...rows].map((cells) => cells.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  Object.assign(document.createElement("a"), { href: url, download: `plumberfinder-analytics-${data.days}d.csv` }).click();
  URL.revokeObjectURL(url);
}
