"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";

export default function SecurityPage() {
  return (
    <DashboardShell title="Privacy & Security" description="Manage your account security settings.">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-600">Coming soon – you will be able to update your password here.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Enhance account security with 2FA (coming soon).</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}