import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

const content = {
  title: "Billing",
  description: "Track plan status, lead credits, payouts, invoices, subscriptions, and payment methods.",
  stats: [
    { label: "Plan", value: "Pro", detail: "Renews June 1" },
    { label: "Lead credits", value: "184", detail: "42 used this month" },
    { label: "Payouts", value: "$26.8k", detail: "Next deposit Friday" },
  ],
  tasks: [
    { title: "Download April invoice", status: "Ready", detail: "Includes lead credit usage." },
    { title: "Update card ending 0428", status: "Optional", detail: "Expires in September." },
    { title: "Review payout hold", status: "Action", detail: "Tax form confirmation needed." },
  ],
};

const table = {
  title: "Billing Center",
  description: "Subscription, lead credits, invoices, and payout activity.",
  headers: ["Item", "Amount", "Due", "Status"],
  rows: [
    ["Pro plan renewal", "$299", "June 1", "Scheduled"],
    ["Lead credits", "184 remaining", "Ongoing", "Healthy"],
    ["April invoice", "$742", "Paid", "Download"],
    ["Payout batch", "$26.8k", "Friday", "Pending"],
  ],
};

export default function BillingSection() {
  return (
 
      <CompanySectionTable table={table} />
   
  );
}
