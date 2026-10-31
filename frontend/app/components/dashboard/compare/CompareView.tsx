"use client";

import { useState } from "react";
import { FaBalanceScale } from "react-icons/fa";
import { userApi, type ListItem } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import EmptyState from "../ui/EmptyState";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import { SkeletonRows } from "../ui/Skeleton";
import ComparePicker from "./ComparePicker";
import CompareTable from "./CompareTable";
import { useCompareDetails } from "./useCompareDetails";

const MAX = 3;
const sameProvider = (a: ListItem, b: ListItem) => a.providerType === b.providerType && a.providerId === b.providerId;

/** /dashboard/compare — up to 3 plumbers side by side. The selection is stored in the account. */
export default function CompareView() {
  const compare = useUserData(userApi.compare);
  const saved = useUserData(userApi.saved);
  const { profiles } = useCompareDetails(compare.data);
  const [busy, setBusy] = useState(false);

  if (!compare.signedIn) return <SignInPrompt what="your comparisons" />;

  const items = compare.data ?? [];
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try { await action(); await compare.reload(); } catch (caught) { compare.setError(caught instanceof Error ? caught.message : "Could not update your comparison."); } finally { setBusy(false); }
  };
  const candidates = (saved.data ?? []).filter((item) => !items.some((chosen) => sameProvider(chosen, item)));

  return (
    <div className="space-y-6">
      <PageHeader icon={FaBalanceScale} title="Compare Plumbers" description={`Put up to ${MAX} plumbers side by side. Your comparison is saved to your account.`}
        actions={items.length > 0 && <button type="button" disabled={busy} onClick={() => run(() => Promise.all(items.map((item) => userApi.removeFromCompare(item))))} className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">Clear all</button>} />

      <Notice>{compare.error}</Notice>

      {compare.loading ? <SkeletonRows rows={1} className="h-80" /> : items.length === 0 ? (
        <EmptyState icon={FaBalanceScale} title="Nothing to compare yet" text="Add plumbers from your saved list below, or tap Compare on any plumber's profile." />
      ) : (
        <CompareTable busy={busy} columns={items.map((item) => ({ item, profile: profiles[item.providerId] }))} onRemove={({ item }) => run(() => userApi.removeFromCompare(item))} />
      )}

      <ComparePicker saved={candidates} slotsLeft={MAX - items.length} busy={busy} onAdd={(item) => run(() => userApi.addToCompare(item))} />
    </div>
  );
}
