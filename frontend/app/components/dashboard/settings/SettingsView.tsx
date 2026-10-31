"use client";

import Link from "next/link";
import { FaBell, FaCog, FaExclamationTriangle, FaGlobe, FaLock } from "react-icons/fa";
import { userApi, type UserSettings } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import Panel from "../ui/Panel";
import { SkeletonRows } from "../ui/Skeleton";
import SettingToggle from "./SettingToggle";

const groups: { title: string; icon: typeof FaBell; options: { id: keyof UserSettings; label: string; description: string }[] }[] = [
  {
    title: "Notifications", icon: FaBell, options: [
      { id: "emailNotifications", label: "Email notifications", description: "Booking and order updates by email" },
      { id: "smsNotifications", label: "SMS notifications", description: "Text messages about your appointments" },
      { id: "pushNotifications", label: "Push notifications", description: "Real-time alerts in your browser" },
      { id: "bookingReminders", label: "Booking reminders", description: "A reminder before each appointment" },
      { id: "marketingEmails", label: "Offers & promotions", description: "Deals from plumbers near you" },
    ],
  },
  { title: "Privacy", icon: FaGlobe, options: [{ id: "publicProfile", label: "Public profile", description: "Show your name on reviews you leave" }] },
];

/** /dashboard/settings — every switch saves at once and rolls back if the save fails. */
export default function SettingsView() {
  const { signedIn, data: settings, setData, error, setError, loading } = useUserData(userApi.settings);
  if (!signedIn) return <SignInPrompt what="your settings" />;

  const toggle = async (key: keyof UserSettings) => {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setData(next);
    setError("");
    try { await userApi.saveSettings({ [key]: next[key] }); } catch (caught) { setData(settings); setError(caught instanceof Error ? caught.message : "Could not save the setting."); }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={FaCog} title="Settings" description="Choose how we contact you. Changes save automatically." />
      <Notice>{error}</Notice>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {loading || !settings ? <SkeletonRows rows={2} className="h-64" /> : groups.map(({ title, icon: Icon, options }) => (
          <Panel key={title} title={<span className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#b39200]" />{title}</span>} bodyClassName="divide-y divide-gray-100">
            {options.map((option) => <SettingToggle key={option.id} label={option.label} description={option.description} checked={settings[option.id]} onChange={() => toggle(option.id)} />)}
          </Panel>
        ))}
        <Panel title={<span className="flex items-center gap-2"><FaLock className="h-4 w-4 text-[#b39200]" />Security</span>} bodyClassName="divide-y divide-gray-100">
          <SettingToggle label="Two-factor authentication" description="Coming soon — an extra layer of security" checked={false} disabled />
          <div className="px-5 py-4 sm:px-6"><Link href="/dashboard/security" className="text-sm font-semibold text-[#0b1f3b] hover:underline">Change password and sign-in methods →</Link></div>
        </Panel>
        <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold text-red-900"><FaExclamationTriangle className="h-4 w-4" /> Delete account</h2>
          <p className="mt-1 text-sm text-red-700">To permanently delete your account and data, contact our support team.</p>
          <Link href="/contact" className="mt-4 inline-block rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">Contact support</Link>
        </section>
      </div>
    </div>
  );
}
