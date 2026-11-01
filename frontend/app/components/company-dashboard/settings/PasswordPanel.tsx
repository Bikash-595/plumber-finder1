"use client";

import { useState, type FormEvent } from "react";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import Notice from "@/components/dashboard/ui/Notice";
import Panel from "@/components/dashboard/ui/Panel";
import { companyApi } from "../companyApi";

const field = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
/** The same rules as the server: 10+ characters, letters and numbers. */
const rules = (pw: string) => [
  { ok: pw.length >= 10, text: "At least 10 characters" },
  { ok: /[a-z]/i.test(pw) && /\d/.test(pw), text: "Letters and numbers" },
  { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[^A-Za-z0-9]/.test(pw), text: "Upper and lower case and a symbol (recommended)" },
];

/** Change (or set) the password. Every other device is signed out; this one stays signed in. */
export default function PasswordPanel({ hasPassword, changedAt, onChanged }: { hasPassword: boolean; changedAt: string | null; onChanged: () => void }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const checks = rules(form.next);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.next !== form.confirm) return setNotice({ tone: "error", text: "The new passwords don't match." });
    if (!checks[0].ok || !checks[1].ok) return setNotice({ tone: "error", text: "Use at least 10 characters with letters and numbers." });
    setBusy(true);
    setNotice(null);
    try {
      const { message } = await companyApi.changePassword({ ...(hasPassword ? { currentPassword: form.current } : {}), newPassword: form.next });
      setForm({ current: "", next: "", confirm: "" });
      setNotice({ tone: "success", text: message ?? "Password updated." });
      onChanged();
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not change the password." }); } finally { setBusy(false); }
  };
  const input = (key: keyof typeof form, label: string, auto: string) => (
    <label className="block text-sm font-medium text-gray-700">{label}
      <input type={show ? "text" : "password"} required autoComplete={auto} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={field} />
    </label>
  );
  return (
    <Panel title={<span className="flex items-center gap-2"><FaKey className="h-4 w-4 text-[#b39200]" />{hasPassword ? "Change password" : "Set a password"}</span>}
      description={changedAt ? `Last changed ${new Date(changedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.` : hasPassword ? "Use a strong password you don't use anywhere else." : "You sign in with Google or Apple. Add a password to also sign in with your email."}>
      <form onSubmit={submit} className="max-w-md space-y-4">
        {hasPassword && input("current", "Current password", "current-password")}
        <div className="relative">
          {input("next", "New password", "new-password")}
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide passwords" : "Show passwords"} className="absolute bottom-2.5 right-3 text-gray-400 hover:text-gray-700">{show ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}</button>
        </div>
        {form.next && <ul className="space-y-1 text-xs" aria-live="polite">{checks.map((rule) => <li key={rule.text} className={rule.ok ? "text-emerald-700" : "text-gray-500"}>{rule.ok ? "✓" : "○"} {rule.text}</li>)}</ul>}
        {input("confirm", "Confirm new password", "new-password")}
        {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
        <button type="submit" disabled={busy} className="rounded-full bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : hasPassword ? "Update password" : "Set password"}</button>
        <p className="text-xs text-gray-500">Changing your password signs you out on every other device.</p>
      </form>
    </Panel>
  );
}
