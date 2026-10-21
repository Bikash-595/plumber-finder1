"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import LocalMediaUpload from "@/components/company-dashboard/business-profile/LocalMediaUpload";
import { readStoredUser, storeUser } from "@/components/utils/auth";
import { userApi, type Profile } from "@/components/utils/userApi";

function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({ name: profile.name, phone: profile.phone ?? "", address: profile.address ?? "", avatarUrl: profile.avatarUrl ?? "" });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const input = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const { data } = await userApi.saveProfile(form);
      // Keep the navbar name/avatar in step with the saved profile.
      const stored = readStoredUser();
      if (stored) storeUser({ ...stored, name: data.name, avatarUrl: data.avatarUrl || stored.avatarUrl });
      window.dispatchEvent(new Event("storage"));
      setNotice({ tone: "success", text: "Profile saved." });
    } catch (caught) {
      setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save your profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <LocalMediaUpload label="Profile photo" value={form.avatarUrl} onChange={(avatarUrl) => setForm({ ...form, avatarUrl })} />
      <label className="block text-sm font-medium text-gray-700">Full Name
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
      </label>
      <label className="block text-sm font-medium text-gray-700">Email Address
        <input type="email" value={profile.email} readOnly className={`${input} cursor-not-allowed bg-gray-50 text-gray-500`} />
        <span className="mt-1 block text-xs text-gray-500">Contact support to change the email on your account.</span>
      </label>
      <label className="block text-sm font-medium text-gray-700">Phone
        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
      </label>
      <label className="block text-sm font-medium text-gray-700">Home Address
        <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Used to pre-fill your bookings" className={input} />
      </label>
      {notice && <p className={`rounded-lg px-3 py-2 text-sm ${notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{notice.text}</p>}
      <button type="submit" disabled={saving} className="rounded-full bg-[#FFD60A] px-6 py-2 font-semibold text-[#0b1f3b] shadow-sm transition hover:brightness-105 disabled:opacity-50">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default function ProfileSettingsPage() {
  const { signedIn, data: profile, error } = useUserData(userApi.profile);
  if (!signedIn) return <SignInPrompt what="your profile" />;

  return (
    <DashboardShell title="Profile Settings" description="Update your personal information">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {profile ? <ProfileForm key={profile._id} profile={profile} /> : !error && <p className="text-gray-500">Loading profile…</p>}
      </div>
    </DashboardShell>
  );
}
