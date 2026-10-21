import type { ReactNode } from "react";
import FreelancerProfileMenu from "@/components/freelancer-dashboard/business-profile/FreelancerProfileMenu";

export default function FreelancerBusinessProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Freelancer workspace</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Business Profile</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-500">Everything customers see on your public profile. Save “Your Profile” first to appear in the freelancer directory.</p>
      </div>
      <FreelancerProfileMenu />
      {children}
    </div>
  );
}
