"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { FaCalendarCheck, FaPlus } from "react-icons/fa";
import SignInPrompt from "../../SignInPrompt";
import { usePagedList } from "../../useUserData";
import ConfirmDialog from "../../ui/ConfirmDialog";
import EmptyState from "../../ui/EmptyState";
import FilterTabs from "../../ui/FilterTabs";
import LoadMore from "../../ui/LoadMore";
import Notice from "../../ui/Notice";
import PageHeader from "../../ui/PageHeader";
import SearchBox from "../../ui/SearchBox";
import { SkeletonRows } from "../../ui/Skeleton";
import { userApi, type Booking, type BookingPageExtra } from "@/components/utils/userApi";
import BookingCard from "../BookingCard";
import { bookingFilters } from "../bookingStatus";

type Filter = (typeof bookingFilters)[number]["value"];

export default function BookingsViewContent({ initialSearch }: { initialSearch: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState(initialSearch);
  const status = filter === "all" ? undefined : filter;
  const list = usePagedList<Booking, BookingPageExtra>(`bookings?status=${status ?? ""}&q=${search}`, (cursor) => userApi.bookingsPage({ status, q: search, cursor }));
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [disputing, setDisputing] = useState<Booking | null>(null);
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const onSearch = useCallback((value: string) => setSearch(value), []);

  if (!list.signedIn) return <SignInPrompt what="your bookings" />;

  const counts = list.extra.counts;
  const total = counts ? Object.values(counts).reduce((sum, count) => sum + count, 0) : undefined;

  const cancel = async (reason: string) => {
    const booking = cancelling;
    if (!booking) return;
    setCancelling(null);
    setBusyId(booking._id);
    try {
      const { data } = await userApi.cancelBooking(booking._id, reason || undefined);
      list.update((items) => items.map((item) => (item._id === data._id ? data : item)), counts && { counts: { ...counts, [booking.status]: counts[booking.status] - 1, cancelled: counts.cancelled + 1 } });
    } catch (caught) {
      list.setError(caught instanceof Error ? caught.message : "Could not cancel the booking.");
    } finally {
      setBusyId(null);
    }
  };

  const replace = (data: Booking, from: Booking["status"]) => list.update((items) => items.map((item) => (item._id === data._id ? data : item)), counts && { counts: { ...counts, [from]: counts[from] - 1, [data.status]: counts[data.status] + 1 } });
  const answer = async (booking: Booking, action: () => Promise<{ data: Booking; message?: string }>) => {
    setBusyId(booking._id);
    setNotice("");
    try {
      const { data, message } = await action();
      replace(data, booking.status);
      setNotice(message ?? "Saved.");
    } catch (caught) {
      list.setError(caught instanceof Error ? caught.message : "Could not update the booking.");
    } finally {
      setBusyId(null);
    }
  };
  const confirm = (booking: Booking) => answer(booking, () => userApi.confirmBooking(booking._id));
  const dispute = (reason: string) => {
    const booking = disputing;
    setDisputing(null);
    if (!booking) return;
    if (reason.length < 5) return list.setError("Tell us what isn't finished, so we can help.");
    return answer(booking, () => userApi.disputeBooking(booking._id, reason));
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={FaCalendarCheck} title="My Bookings" description="Track requests, confirmed visits and past jobs."
        actions={<Link href="/book-plumber" className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b] shadow-sm hover:brightness-95"><FaPlus className="h-3 w-3" /> New booking</Link>} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs label="Filter bookings by status" value={filter} onChange={setFilter}
          options={bookingFilters.map((option) => ({ ...option, count: option.value === "all" ? total : counts?.[option.value] }))} />
        <SearchBox label="Search bookings" placeholder="Search service, plumber or BK- code" value={search} onChange={onSearch} />
      </div>

      <Notice>{list.error}</Notice>
      <Notice tone="success">{notice}</Notice>

      {list.loading ? <SkeletonRows rows={3} className="h-40" /> : list.items.length === 0 ? (
        <EmptyState icon={FaCalendarCheck} title={search || filter !== "all" ? "No matching bookings" : "No bookings yet"}
          text={search || filter !== "all" ? "Try another status or search." : "Send a booking request from any plumber's profile and it will appear here."}
          action={search || filter !== "all" ? undefined : { label: "Find a plumber", href: "/find" }} />
      ) : (
        <div className="space-y-4">
          {list.items.map((booking) => <BookingCard key={booking._id} booking={booking} busy={busyId === booking._id} onCancel={setCancelling} onConfirm={confirm} onDispute={setDisputing} onRefresh={list.reload} />)}
          <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} shown={list.items.length} noun="bookings" />
        </div>
      )}

      <ConfirmDialog open={Boolean(cancelling)} title="Cancel this booking?" confirmLabel="Cancel booking"
        message={cancelling ? `${cancelling.service} with ${cancelling.providerName}. The plumber will be told straight away.` : ""}
        reasonLabel="Reason (optional — the plumber will see it)" onConfirm={cancel} onClose={() => setCancelling(null)} />
      <ConfirmDialog open={Boolean(disputing)} title="Report a problem with this job" confirmLabel="Send to Plumber Finder" tone="primary"
        message={disputing ? `${disputing.service} with ${disputing.providerName}. We'll pause the job and look into it with you and the plumber.` : ""}
        reasonLabel="What isn't finished? (required)" onConfirm={dispute} onClose={() => setDisputing(null)} />
    </div>
  );
}
