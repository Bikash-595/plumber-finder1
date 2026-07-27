import type { ReactNode } from "react";
import Link from "next/link";
import AdminSectionPage from "@/components/admin-dashboard/AdminSectionPage";

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

export default function AdminPlaceholderPage({
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: AdminPlaceholderPageProps) {
  return (
    <AdminSectionPage
      title={title}
      description={description}
      actions={
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0b1f3b] shadow-sm transition hover:bg-gray-100"
          >
            {actionLabel || "Back"}
          </Link>
        ) : undefined
      }
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-700">{description}</p>
        {children ? (
          <div className="mt-6 text-sm text-gray-600">{children}</div>
        ) : (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-gray-700">
            This area is reserved for advanced admin controls and reports for the selected section.
          </div>
        )}
      </section>
    </AdminSectionPage>
  );
}
