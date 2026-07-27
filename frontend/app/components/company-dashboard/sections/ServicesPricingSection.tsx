import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

const content = {
  title: "Services & Pricing",
  description: "Maintain service catalog, starting prices, discounts, warranties, and emergency fees.",
  stats: [
    { label: "Published services", value: "32", detail: "8 featured services" },
    { label: "Active discounts", value: "4", detail: "Two expire this week" },
    { label: "Quote templates", value: "15", detail: "Ready for dispatch" },
  ],
  tasks: [
    { title: "Update water heater install price", status: "Review", detail: "Material costs changed this week." },
    { title: "Add hydro jetting package", status: "Draft", detail: "Include camera inspection add-on." },
    { title: "Refresh senior discount", status: "Expiring", detail: "Ends Friday at midnight." },
  ],
};

const table = {
  title: "Service Catalog",
  description: "Visible services, starting prices, and quote readiness.",
  headers: ["Service", "Starting Price", "Warranty", "Status"],
  rows: [
    ["Leak detection", "$129", "90 days", "Featured"],
    ["Water heater install", "$1,250", "2 years", "Review price"],
    ["Drain cleaning", "$149", "30 days", "Live"],
    ["Hydro jetting", "$399", "90 days", "Draft"],
  ],
};

export default function ServicesPricingSection() {
  return (

      <CompanySectionTable table={table} />

  );
}
