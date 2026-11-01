"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Notice from "@/components/dashboard/ui/Notice";
import Panel from "@/components/dashboard/ui/Panel";
import StatusPill from "@/components/dashboard/ui/StatusPill";
import { companyApi, type CompanySettings } from "../companyApi";

const statusTone = { approved: "success", pending: "warning", suspended: "danger" } as const;
const statusText = { approved: "Approved", pending: "Waiting for approval", suspended: "Suspended" } as const;
const field = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/** The login account: email (fixed), account phone, approval status. The public name and details live on the profile. */
export default function AccountPanel({ account, onSaved }: { account: CompanySettings["account"]; onSaved: (account: CompanySettings["account"]) => void }) {
  const [phone, setPhone] = useState(account.phone);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try { const { data, message } = await companyApi.saveAccount({ phone: phone.trim() }); onSaved(data); setNotice({ tone: "success", text: message ?? "Saved." }); } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };
  const status = (account.status in statusText ? account.status : "pending") as keyof typeof statusText;
  return (
    <Panel title="Account" description="The login for your company. Your public name, logo and contact details are edited on your profile.">
      <form onSubmit={save} className="space-y-4">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company</dt><dd className="mt-1 font-semibold text-gray-900">{account.companyName} <Link href="/company-dashboard/business-profile/header-profile" className="ml-1 text-xs font-semibold text-[#8a7300] hover:underline">Edit profile</Link></dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Approval</dt><dd className="mt-1"><StatusPill tone={statusTone[status]}>{statusText[status]}</StatusPill></dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Login email</dt><dd className="mt-1 flex flex-wrap items-center gap-2 text-gray-900">{account.email}{account.emailVerified ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><FaCheckCircle className="h-3 w-3" /> Verified</span> : <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><FaExclamationCircle className="h-3 w-3" /> Not verified</span>}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Member since</dt><dd className="mt-1 text-gray-900">{new Date(account.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</dd></div>
        </dl>
        <label className="block max-w-sm text-sm font-medium text-gray-700">Account phone <span className="font-normal text-gray-400">(for Plumber Finder to reach you)</span>
          <input type="tel" maxLength={40} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
        </label>
        {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
        <button type="submit" disabled={busy || phone.trim() === account.phone} className="rounded-full bg-[#FFD60A] px-5 py-2 text-sm font-bold text-[#0b1f3b] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </form>
    </Panel>
  );
}
