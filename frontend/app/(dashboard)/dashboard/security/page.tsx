"use client";

import { useState } from "react";
import { FaApple, FaCheckCircle, FaGoogle, FaKey } from "react-icons/fa";
import DashboardShell from "@/components/dashboard/DashboardShell";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { userApi } from "@/components/utils/userApi";

export default function SecurityPage() {
  const { signedIn, data: status, reload } = useUserData(userApi.security);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  if (!signedIn) return <SignInPrompt what="your security settings" />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.newPassword !== form.confirm) return setNotice({ tone: "error", text: "The new passwords do not match." });
    setBusy(true);
    setNotice(null);
    try {
      const result = await userApi.changePassword({ ...(status?.hasPassword ? { currentPassword: form.currentPassword } : {}), newPassword: form.newPassword });
      setNotice({ tone: "success", text: result.message ?? "Password updated." });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
      await reload();
    } catch (caught) {
      setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not change the password." });
    } finally {
      setBusy(false);
    }
  };
  const input = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]";

  return (
    <DashboardShell title="Privacy & Security" description="Manage how you sign in to your account.">
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3"><FaKey className="h-5 w-5 text-[#FFD60A]" /><h3 className="text-lg font-semibold text-gray-900">{status?.hasPassword === false ? "Set a Password" : "Change Password"}</h3></div>
          {status?.hasPassword === false && <p className="mt-2 text-sm text-gray-600">You sign in with Google or Apple. Set a password to also sign in with your email.</p>}
          <form onSubmit={submit} className="mt-5 max-w-md space-y-4">
            {status?.hasPassword !== false && (
              <label className="block text-sm font-medium text-gray-700">Current password
                <input type="password" required autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={input} />
              </label>
            )}
            <label className="block text-sm font-medium text-gray-700">New password
              <input type="password" required minLength={8} autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={input} />
            </label>
            <label className="block text-sm font-medium text-gray-700">Confirm new password
              <input type="password" required minLength={8} autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={input} />
            </label>
            <p className="text-xs text-gray-500">At least 8 characters.</p>
            {notice && <p className={`rounded-lg px-3 py-2 text-sm ${notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{notice.text}</p>}
            <button type="submit" disabled={busy || !status} className="rounded-full bg-[#FFD60A] px-6 py-2 font-semibold text-[#0b1f3b] shadow-sm transition hover:brightness-105 disabled:opacity-50">
              {busy ? "Saving…" : status?.hasPassword === false ? "Set password" : "Update password"}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Sign-in methods</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3"><FaKey className="h-4 w-4 text-gray-500" /> Email &amp; password {status?.hasPassword ? <FaCheckCircle className="text-emerald-500" aria-label="enabled" /> : <span className="text-gray-400">not set</span>}</li>
            <li className="flex items-center gap-3"><FaGoogle className="h-4 w-4 text-gray-500" /> Google {status?.googleLinked ? <FaCheckCircle className="text-emerald-500" aria-label="linked" /> : <span className="text-gray-400">not linked</span>}</li>
            <li className="flex items-center gap-3"><FaApple className="h-4 w-4 text-gray-500" /> Apple {status?.appleLinked ? <FaCheckCircle className="text-emerald-500" aria-label="linked" /> : <span className="text-gray-400">not linked</span>}</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">Two-factor authentication is coming soon.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
