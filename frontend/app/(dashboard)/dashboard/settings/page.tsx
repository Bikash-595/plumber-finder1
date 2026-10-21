"use client";

import Link from "next/link";
import { FaBell, FaGlobe, FaLock } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { userApi, type UserSettings } from "@/components/utils/userApi";

function Toggle({ label, desc, checked, onChange, disabled }: { label: string; desc: string; checked: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-[#FFD60A]" : "bg-gray-300"} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

const notificationOptions: { id: keyof UserSettings; label: string; desc: string }[] = [
  { id: "emailNotifications", label: "Email Notifications", desc: "Receive booking and order updates via email" },
  { id: "smsNotifications", label: "SMS Notifications", desc: "Get text messages about your appointments" },
  { id: "pushNotifications", label: "Push Notifications", desc: "Get real-time notifications" },
  { id: "bookingReminders", label: "Booking Reminders", desc: "A reminder before each appointment" },
  { id: "marketingEmails", label: "Marketing Emails", desc: "Receive promotions and offers" },
];

export default function SettingsPage() {
  const { signedIn, data: settings, setData, error, setError, loading } = useUserData(userApi.settings);

  if (!signedIn) return <SignInPrompt what="your settings" />;

  // Each switch saves immediately (and rolls back if the save fails).
  const toggle = async (key: keyof UserSettings) => {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setData(next);
    setError("");
    try { await userApi.saveSettings({ [key]: next[key] }); } catch (caught) { setData(settings); setError(caught instanceof Error ? caught.message : "Could not save the setting."); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account preferences. Changes save automatically.</p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}
      {loading || !settings ? <p className="text-gray-500">Loading settings…</p> : (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><FaBell className="h-6 w-6 text-[#FFD60A]" /><h2 className="text-lg font-bold text-gray-900">Notifications</h2></div>
            <div className="mt-6 space-y-4">
              {notificationOptions.map((option) => <Toggle key={option.id} label={option.label} desc={option.desc} checked={settings[option.id]} onChange={() => toggle(option.id)} />)}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><FaLock className="h-6 w-6 text-[#FFD60A]" /><h2 className="text-lg font-bold text-gray-900">Security</h2></div>
            <div className="mt-6 space-y-4">
              <Toggle label="Two-Factor Authentication" desc="Coming soon — an extra layer of security for your account" checked={false} disabled />
              <Link href="/dashboard/security" className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-left font-medium text-gray-900 transition hover:bg-gray-50">
                Change Password
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><FaGlobe className="h-6 w-6 text-[#FFD60A]" /><h2 className="text-lg font-bold text-gray-900">Privacy</h2></div>
            <div className="mt-6 space-y-4">
              <Toggle label="Public Profile" desc="Let plumbers see your name on reviews you leave" checked={settings.publicProfile} onChange={() => toggle("publicProfile")} />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold text-red-900">Delete Account</h2>
        <p className="mt-2 text-sm text-red-700">To permanently delete your account and data, contact our support team.</p>
        <Link href="/contact" className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700">
          Contact support
        </Link>
      </div>
    </div>
  );
}
