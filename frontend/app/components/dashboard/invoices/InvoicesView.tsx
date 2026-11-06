"use client";

import { useSearchParams } from "next/navigation";
import InvoicesViewContent from "@/components/dashboard/invoices/invoices-view/InvoicesViewContent";

/** /dashboard/invoices — money owed and paid, then every invoice, filtered and searchable, one page at a time. */
export default function InvoicesView() {
  // Remount when the navbar search sends a new ?q=, so the list starts from that search.
  const initialSearch = useSearchParams().get("q") ?? "";
  return <InvoicesViewContent key={initialSearch} initialSearch={initialSearch} />;
}
