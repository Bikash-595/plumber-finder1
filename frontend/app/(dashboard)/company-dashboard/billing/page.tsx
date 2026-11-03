import { redirect } from "next/navigation";

/** Billing lives on the Premium & Billing page. */
export default function BillingPage() {
  redirect("/company-dashboard/premium");
}
