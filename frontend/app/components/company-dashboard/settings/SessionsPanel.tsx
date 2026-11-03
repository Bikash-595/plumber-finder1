"use client";

import { useState } from "react";
import { FaApple, FaDesktop, FaGoogle, FaKey, FaMobileAlt, FaShieldAlt } from "react-icons/fa";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import Notice from "@/components/dashboard/ui/Notice";
import Panel from "@/components/dashboard/ui/Panel";
import StatusPill from "@/components/dashboard/ui/StatusPill";
import { companyApi, type CompanySettings } from "../companyApi";

/** "Chrome on macOS" from a browser's user-agent string (best effort). */
function device(ua = "") {
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "unknown device";
  return { label: `${browser} on ${os}`, mobile: /iPhone|Android|Mobile/.test(ua) };
}
const methodLabel = (method?: string) => (method === "google" ? "Google" : method === "apple" ? "Apple" : method === "signup" ? "Account created" : method?.startsWith("verify") ? "Email code" : "Password");

/** Sign-in methods, the last 10 sign-ins, and "sign out of every other device". */
export default function SessionsPanel({ security, onSignedOut }: { security: CompanySettings["security"]; onSignedOut: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const signOutAll = async () => {
    setConfirming(false);
    setBusy(true);
    try { const { message } = await companyApi.signOutEverywhere(); setNotice({ tone: "success", text: message ?? "Signed out of other devices." }); onSignedOut(); } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not sign out other devices." }); } finally { setBusy(false); }
  };
  const methods = [
    { icon: FaKey, label: "Email & password", on: security.hasPassword },
    { icon: FaGoogle, label: "Google", on: security.googleLinked },
    { icon: FaApple, label: "Apple", on: security.appleLinked },
  ];
  return (
    <Panel title={<span className="flex items-center gap-2"><FaShieldAlt className="h-4 w-4 text-[#b39200]" />Sign-in security</span>} description="Check recent sign-ins. If one wasn't you, change your password and sign out everywhere."
      action={<button type="button" disabled={busy} onClick={() => setConfirming(true)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">Sign out other devices</button>}>
      <div className="space-y-5">
        <ul className="flex flex-wrap gap-2">{methods.map(({ icon: Icon, label, on }) => <li key={label} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm"><Icon className="h-3.5 w-3.5 text-gray-500" />{label}<StatusPill tone={on ? "success" : "neutral"}>{on ? "On" : "Off"}</StatusPill></li>)}</ul>
        {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Recent sign-ins</p>
          {security.recentLogins.length === 0 ? <p className="text-sm text-gray-500">No sign-ins recorded yet.</p> : (
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
              {security.recentLogins.map((login, index) => {
                const { label, mobile } = device(login.userAgent);
                const Icon = mobile ? FaMobileAlt : FaDesktop;
                return (
                  <li key={login._id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                    <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="min-w-0 flex-1"><span className="block font-medium text-gray-900">{label}{index === 0 && <span className="ml-2 text-xs font-semibold text-emerald-700">Latest</span>}</span><span className="block text-xs text-gray-500">{methodLabel(login.method)} · IP {login.ip ?? "unknown"}</span></span>
                    <time dateTime={login.createdAt} className="shrink-0 text-xs text-gray-500">{new Date(login.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <ConfirmDialog open={confirming} title="Sign out of every other device?" confirmLabel="Sign out other devices" busy={busy}
        message="Anyone signed in to your account elsewhere — including on other phones, computers or browsers — will have to log in again. You stay signed in here."
        onConfirm={signOutAll} onClose={() => setConfirming(false)} />
    </Panel>
  );
}
