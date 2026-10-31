import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate, type Booking } from "@/components/utils/userApi";
import Panel from "../ui/Panel";
import { Skeleton } from "../ui/Skeleton";
import StatusPill from "../ui/StatusPill";
import { bookingStatus } from "../bookings/bookingStatus";

/** The next pending or confirmed bookings, soonest first, each shown as a date tile. */
export default function UpcomingBookings({ bookings }: { bookings?: Booking[] }) {
  return (
    <Panel title="Upcoming bookings" action={<Link href="/dashboard/bookings" className="text-sm font-semibold text-[#8a7300] hover:underline">View all →</Link>}>
      {!bookings ? <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div> : bookings.length === 0 ? (
        <div className="py-4 text-center">
          <FaCalendarAlt className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No upcoming bookings.</p>
          <Link href="/find" className="mt-3 inline-block text-sm font-semibold text-[#0b1f3b] hover:underline">Book a plumber →</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            const date = booking.scheduledDate ? new Date(booking.scheduledDate) : null;
            return (
              <li key={booking._id}>
                <Link href="/dashboard/bookings" className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/5">
                  <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#0b1f3b] text-white">
                    {date ? <><span className="text-[10px] font-semibold uppercase text-[#FFD60A]">{date.toLocaleDateString(undefined, { month: "short", timeZone: "UTC" })}</span><span className="text-lg font-bold leading-none">{date.getUTCDate()}</span></> : <FaCalendarAlt className="h-4 w-4 text-[#FFD60A]" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{booking.service}</p>
                    <p className="truncate text-xs text-gray-600">{booking.providerName}</p>
                    <p className="text-xs text-gray-500">{date ? formatDate(booking.scheduledDate) : "Date to be confirmed"}{booking.timeSlot ? ` · ${booking.timeSlot}` : ""}</p>
                  </div>
                  <span className="hidden sm:block"><StatusPill tone={bookingStatus[booking.status].tone}>{bookingStatus[booking.status].label}</StatusPill></span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
