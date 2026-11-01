"use client";

import Link from "next/link";
import { FaCog, FaLifeRing } from "react-icons/fa";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { companyApi, useCompanyData } from "../companyApi";
import AccountPanel from "./AccountPanel";
import NotificationPrefs from "./NotificationPrefs";
import PasswordPanel from "./PasswordPanel";
import SessionsPanel from "./SessionsPanel";

/** /company-dashboard/settings — account, email notifications, password and sign-in security. */
export default function CompanySettingsView() {
  const { data, error, loading, reload, setData } = useCompanyData("company-settings", companyApi.settings);
  return (
    <div className="space-y-6">
      <PageHeader icon={FaCog} title="Settings" description="Your account, how we notify you, and how your company account is protected." />
      <Notice>{error}</Notice>
      {loading || !data ? <SkeletonRows rows={3} className="h-48" /> : (
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <div className="min-w-0 space-y-6">
            <AccountPanel key={data.account.phone} account={data.account} onSaved={(account) => setData({ ...data, account })} />
            <NotificationPrefs preferences={data.preferences} onSaved={(preferences) => setData({ ...data, preferences })} />
            <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
              <p className="flex items-center gap-2 font-bold text-gray-900"><FaLifeRing className="h-4 w-4 text-[#b39200]" /> Need help or want to close your account?</p>
              <p className="mt-1 text-sm text-gray-600">Our team can transfer ownership, merge listings or delete your company and its data.</p>
              <Link href="/contact" className="mt-3 inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">Contact support</Link>
            </section>
          </div>
          <div className="min-w-0 space-y-6">
            <PasswordPanel hasPassword={data.security.hasPassword} changedAt={data.security.passwordChangedAt} onChanged={reload} />
            <SessionsPanel security={data.security} onSignedOut={reload} />
          </div>
        </div>
      )}
    </div>
  );
}
