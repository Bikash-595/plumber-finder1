/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { readStoredUser, storeUser, type AppUser } from "@/components/utils/auth";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(storedUser);
    setName(storedUser.name);
    setEmail(storedUser.email);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = { ...user, name, email };
      storeUser(updatedUser);
      setSaving(true);
      setTimeout(() => setSaving(false), 1000);
    }
  };

  if (!user) return null;

  return (
    <DashboardShell title="Profile Settings" description="Update your personal information">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#FFD60A] px-6 py-2 font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
