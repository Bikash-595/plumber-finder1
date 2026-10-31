"use client";

import Link from "next/link";
import { FaHeart, FaSearch } from "react-icons/fa";
import SavedList from "@/components/dashboard/saved/SavedList";
import PageHeader from "@/components/dashboard/ui/PageHeader";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <PageHeader icon={FaHeart} title="Saved Plumbers" description="Plumbers and deals you've kept for later."
        actions={<Link href="/find" className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b] hover:brightness-95"><FaSearch className="h-3 w-3" /> Find more</Link>} />
      <SavedList />
    </div>
  );
}
