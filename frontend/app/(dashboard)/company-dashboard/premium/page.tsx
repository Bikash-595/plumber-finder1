import { Suspense } from "react";
import PremiumDashboard from "@/components/premium/dashboard/PremiumDashboard";

/** Premium & Billing: plans, the current plan, and billing history. */
export default function PremiumPage() {
  return <Suspense fallback={null}><PremiumDashboard /></Suspense>;
}
