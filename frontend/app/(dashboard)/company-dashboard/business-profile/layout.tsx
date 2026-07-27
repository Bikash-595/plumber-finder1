import type { ReactNode } from "react";
import ProfileMenu from "@/components/company-dashboard/business-profile/ProfileMenu";

export default function BusinessProfileLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Company workspace</p><h1 className="mt-1 text-3xl font-bold text-gray-900">Business Profile</h1><p className="mt-2 text-sm text-gray-500">Build the profile customers see, one focused section at a time.</p></div><ProfileMenu />{children}</div>;
}
