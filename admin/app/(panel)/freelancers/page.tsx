"use client";

import { Suspense } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import FreelancersManager from "@/components/freelancers/FreelancersManager";

export default function AdminFreelancersPage() {
  return (
    <AdminSectionPage title="Freelancer Management" description="Review freelance plumbers, their directory profiles, and verification.">
      <Suspense fallback={null}><FreelancersManager /></Suspense>
    </AdminSectionPage>
  );
}
