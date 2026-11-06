import { Suspense } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import DirectoryManager from "@/components/directory/DirectoryManager";

export default function AdminDirectoryPage() {
  return (
    <AdminSectionPage title="Premium Directory & SEO" description="Premium-only Top 10 and Top 50 rankings for the USA, every state and city: ranking rules, premium eligibility, landing pages and SEO, placements, page templates, sitemaps and search analytics.">
      <Suspense fallback={null}><DirectoryManager /></Suspense>
    </AdminSectionPage>
  );
}
