"use client";

import { Suspense } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import CompaniesManager from "@/components/companies/CompaniesManager";

export default function AdminCompaniesPage() {
  return (
    <AdminSectionPage title="Company Management" description="Review company accounts, approval status, and public listings.">
      <Suspense fallback={null}><CompaniesManager /></Suspense>
    </AdminSectionPage>
  );
}
