import { Suspense } from "react";
import CompanyQuotes from "@/components/company-dashboard/quotes/CompanyQuotes";

export default function CompanyQuotesPage() {
  return <Suspense fallback={null}><CompanyQuotes /></Suspense>;
}
