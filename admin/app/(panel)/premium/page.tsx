import { Suspense } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import PremiumManager from "@/components/premium/PremiumManager";

export default function AdminPremiumPage() {
  return (
    <AdminSectionPage title="Premium Plans" description="Paid plans for companies and freelancers: requests, active plans, renewals and payments.">
      <Suspense fallback={null}><PremiumManager /></Suspense>
    </AdminSectionPage>
  );
}
