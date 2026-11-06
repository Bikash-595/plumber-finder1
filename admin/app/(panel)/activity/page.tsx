"use client";

import { Suspense } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import ActivityManager from "@/components/activity/ActivityManager";

export default function AdminActivityPage() {
  return (
    <AdminSectionPage title="Activity" description="Who visited, read, compared, saved, contacted, and booked every plumbing company and freelancer.">
      <Suspense fallback={null}><ActivityManager /></Suspense>
    </AdminSectionPage>
  );
}
