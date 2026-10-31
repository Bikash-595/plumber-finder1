// app/saved/page.tsx
import Link from "next/link";
import SavedList from "@/components/dashboard/saved/SavedList";

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Deals</h1>
            <p className="text-gray-600">Your favorite plumbing companies and offers</p>
          </div>
          <Link href="/find" className="rounded-full bg-[#FFD60A] px-5 py-2 text-sm font-semibold text-[#0b1f3b] transition hover:brightness-105">
            + Find More
          </Link>
        </div>
        <SavedList />
      </div>
    </main>
  );
}
