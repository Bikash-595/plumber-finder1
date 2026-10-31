"use client";

import { useState, type FormEvent } from "react";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { userApi } from "@/components/utils/userApi";
import Notice from "../ui/Notice";
import Panel from "../ui/Panel";
import { passwordStrength } from "./passwordStrength";

const input = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const bars = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];

/** Change the password, or set one for accounts that only use Google/Apple sign-in. */
export default function PasswordForm({ hasPassword, ready, onChanged }: { hasPassword: boolean; ready: boolean; onChanged: () => void }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const strength = passwordStrength(form.newPassword);
  const mismatch = form.confirm.length > 0 && form.confirm !== form.newPassword;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.newPassword !== form.confirm) return setNotice({ tone: "error", text: "The new passwords do not match." });
    setBusy(true);
    setNotice(null);
    try {
      const result = await userApi.changePassword({ ...(hasPassword ? { currentPassword: form.currentPassword } : {}), newPassword: form.newPassword });
      setNotice({ tone: "success", text: result.message ?? "Password updated." });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
      onChanged();
    } catch (caught) {
      setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not change the password." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title={<span className="flex items-center gap-2"><FaKey className="h-4 w-4 text-[#b39200]" />{hasPassword ? "Change password" : "Set a password"}</span>}
      description={hasPassword ? "Use at least 8 characters. A longer password with mixed characters is stronger." : "You sign in with Google or Apple. Set a password to also sign in with your email."}>
      <form onSubmit={submit} className="max-w-md space-y-4">
        {hasPassword && (
          <label className="block text-sm font-medium text-gray-700">Current password
            <input type={show ? "text" : "password"} required autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={input} />
          </label>
        )}
        <label className="relative block text-sm font-medium text-gray-700">New password
          <input type={show ? "text" : "password"} required minLength={8} autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={input} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide passwords" : "Show passwords"} className="absolute bottom-2.5 right-3 text-gray-400 hover:text-gray-700">{show ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}</button>
        </label>
        {form.newPassword && (
          <div aria-live="polite">
            <div className="flex gap-1">{[1, 2, 3, 4].map((step) => <span key={step} className={`h-1.5 flex-1 rounded-full ${strength.score >= step ? bars[strength.score] : "bg-gray-200"}`} />)}</div>
            <p className="mt-1 text-xs text-gray-500">Strength: <span className="font-semibold text-gray-700">{strength.label}</span></p>
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700">Confirm new password
          <input type={show ? "text" : "password"} required minLength={8} autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={`${input} ${mismatch ? "border-red-300" : ""}`} aria-invalid={mismatch} />
          {mismatch && <span className="mt-1 block text-xs text-red-600">Passwords don&apos;t match yet.</span>}
        </label>
        {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
        <button type="submit" disabled={busy || !ready} className="rounded-full bg-[#FFD60A] px-6 py-2.5 text-sm font-bold text-[#0b1f3b] shadow-sm transition hover:brightness-95 disabled:opacity-50">
          {busy ? "Saving…" : hasPassword ? "Update password" : "Set password"}
        </button>
      </form>
    </Panel>
  );
}
