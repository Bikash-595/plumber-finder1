import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

const content = {
  title: "Settings",
  description: "Configure access, notifications, integrations, security, and company dashboard preferences.",
  stats: [
    { label: "Admin users", value: "5", detail: "2 owners, 3 managers" },
    { label: "Integrations", value: "4", detail: "Calendar, CRM, payments" },
    { label: "Security score", value: "88%", detail: "Enable one more MFA user" },
  ],
  tasks: [
    { title: "Enable MFA for dispatcher", status: "Recommended", detail: "Protect lead and customer data." },
    { title: "Sync calendar integration", status: "Connected", detail: "Last sync 12 minutes ago." },
    { title: "Adjust lead notification routing", status: "Open", detail: "Send emergency jobs to owners too." },
  ],
};

const table = {
  title: "Settings Checklist",
  description: "Security, users, integrations, and notification routing.",
  headers: ["Setting", "Configured", "Risk", "Action"],
  rows: [
    ["MFA for owners", "Yes", "Low", "Monitor"],
    ["MFA for dispatchers", "Partial", "Medium", "Enable"],
    ["Calendar sync", "Yes", "Low", "Connected"],
    ["Emergency alerts", "Partial", "High", "Add owners"],
  ],
};

export default function SettingsSection() {
  return (

      <CompanySectionTable table={table} />
   
  );
}
