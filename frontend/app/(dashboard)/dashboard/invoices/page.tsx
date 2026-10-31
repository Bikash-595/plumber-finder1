import { Suspense } from "react";
import InvoicesView from "@/components/dashboard/invoices/InvoicesView";

export default function InvoicesPage() {
  return <Suspense><InvoicesView /></Suspense>;
}
