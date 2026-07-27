/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FaBell, FaLock, FaGlobe, FaToggleOn } from "react-icons/fa";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    twoFactor: false,
    publicProfile: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account preferences and settings.</p>
      </div>

      {/* Notification Settings */}
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BellIcon className="h-6 w-6 text-[#FFD60A]" />
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          </div>
          
          <div className="mt-6 space-y-4">
            {[
              { id: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
              { id: "pushNotifications", label: "Push Notifications", desc: "Get real-time notifications" },
              { id: "marketingEmails", label: "Marketing Emails", desc: "Receive promotions and offers" },
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{setting.label}</p>
                  <p className="text-sm text-gray-600">{setting.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(setting.id as keyof typeof settings)}
                  className={`rounded-full p-2 transition ${
                    settings[setting.id as keyof typeof settings]
                      ? "bg-[#FFD60A] text-gray-900"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <FaToggleOn className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FaLock className="h-6 w-6 text-[#FFD60A]" />
            <h2 className="text-lg font-bold text-gray-900">Security</h2>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => handleToggle("twoFactor")}
                className={`rounded-full p-2 transition ${
                  settings.twoFactor ? "bg-[#FFD60A] text-gray-900" : "bg-gray-200 text-gray-600"
                }`}
              >
                <FaToggleOn className="h-6 w-6" />
              </button>
            </div>
            
            <button className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 transition">
              Change Password
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FaGlobe className="h-6 w-6 text-[#FFD60A]" />
            <h2 className="text-lg font-bold text-gray-900">Privacy</h2>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="font-medium text-gray-900">Public Profile</p>
                <p className="text-sm text-gray-600">Let others find your profile</p>
              </div>
              <button
                onClick={() => handleToggle("publicProfile")}
                className={`rounded-full p-2 transition ${
                  settings.publicProfile ? "bg-[#FFD60A] text-gray-900" : "bg-gray-200 text-gray-600"
                }`}
              >
                <FaToggleOn className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
        <p className="mt-2 text-sm text-red-700">Permanent actions that cannot be undone</p>
        <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition">
          Delete Account
        </button>
      </div>
    </div>
  );
}

function BellIcon(props: any) {
  return <FaBell {...props} />;
}
