"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaBalanceScale, FaHeart } from "react-icons/fa";
import { userApi, type ListItem } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import EmptyState from "../ui/EmptyState";
import Notice from "../ui/Notice";
import SearchBox from "../ui/SearchBox";
import { SkeletonRows } from "../ui/Skeleton";
import SavedCard from "./SavedCard";

type Sort = "recent" | "rating" | "name";
const sorters: Record<Sort, (a: ListItem, b: ListItem) => number> = {
  recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  name: (a, b) => a.name.localeCompare(b.name),
};
const key = (item: { providerType: string; providerId: string }) => `${item.providerType}:${item.providerId}`;

/** The customer's saved plumbers (max 200), used by /saved and /dashboard/saved. Search and sort run locally. */
export default function SavedList() {
  const saved = useUserData(userApi.saved);
  const compare = useUserData(userApi.compare);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("recent");
  const [busy, setBusy] = useState<string | null>(null);

  const comparing = useMemo(() => new Set((compare.data ?? []).map(key)), [compare.data]);
  const visible = useMemo(() => {
    const text = search.toLowerCase();
    return (saved.data ?? []).filter((item) => !text || `${item.name} ${item.location ?? ""}`.toLowerCase().includes(text)).sort(sorters[sort]);
  }, [saved.data, search, sort]);

  if (!saved.signedIn) return <SignInPrompt what="your saved plumbers" />;
  if (saved.loading) return <SkeletonRows rows={2} className="h-40" />;

  const run = async (item: ListItem, action: () => Promise<unknown>, fallback: string) => {
    setBusy(key(item));
    try { await action(); } catch (caught) { saved.setError(caught instanceof Error ? caught.message : fallback); } finally { setBusy(null); }
  };
  const remove = (item: ListItem) => run(item, async () => {
    const previous = saved.data;
    saved.setData(previous?.filter((entry) => entry._id !== item._id)); // optimistic
    try { await userApi.unsave(item); } catch (caught) { saved.setData(previous); throw caught; }
  }, "Could not remove this plumber.");
  const toggleCompare = (item: ListItem) => run(item, () => (comparing.has(key(item)) ? userApi.removeFromCompare(item) : userApi.addToCompare(item)), "Could not update your comparison.");

  if (!saved.data?.length) {
    return <EmptyState icon={FaHeart} title="No saved plumbers yet" text="Tap Save on any plumber's profile to keep them here for later." action={{ label: "Browse plumbers", href: "/find" }} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox label="Search saved plumbers" placeholder="Search by name or location" value={search} onChange={setSearch} />
        <div className="flex items-center gap-3">
          {comparing.size > 0 && <Link href="/dashboard/compare" className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white"><FaBalanceScale className="h-3.5 w-3.5" /> Compare ({comparing.size})</Link>}
          <label className="flex items-center gap-2 text-sm text-gray-600">Sort
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800">
              <option value="recent">Recently saved</option>
              <option value="rating">Highest rated</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      </div>
      <Notice>{saved.error || compare.error}</Notice>
      {visible.length === 0 ? <p className="py-8 text-center text-sm text-gray-500">No saved plumbers match “{search}”.</p> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <SavedCard key={item._id} item={item} busy={busy === key(item)} comparing={comparing.has(key(item))} compareFull={comparing.size >= 3}
              onCompare={() => toggleCompare(item)} onRemove={() => remove(item)} />
          ))}
        </div>
      )}
    </div>
  );
}
