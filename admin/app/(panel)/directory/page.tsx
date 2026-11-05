import { Suspense } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import DirectoryManager from "@/components/directory/DirectoryManager";

export default function AdminDirectoryPage() {
  return (
    <AdminSectionPage title="Directory & SEO" description="Top 10 and Top 50 rankings: weights and rules, excluded listings, ranking previews and what visitors search for.">
      <Suspense fallback={null}><DirectoryManager /></Suspense>
    </AdminSectionPage>
  );
}
