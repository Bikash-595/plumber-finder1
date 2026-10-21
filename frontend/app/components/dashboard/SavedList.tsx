"use client";

import Link from "next/link";
import { FaHeart, FaStar, FaTag, FaTrashAlt } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { userApi } from "@/components/utils/userApi";

/** The customer's saved plumbers, used by /saved and /dashboard/saved. */
export default function SavedList() {
  const { signedIn, data: saved, setData, error, setError, loading } = useUserData(userApi.saved);

  if (!signedIn) return <SignInPrompt what="your saved plumbers" />;
  if (loading) return <p className="py-12 text-center text-gray-500">Loading saved plumbers…</p>;

  const remove = async (item: NonNullable<typeof saved>[number]) => {
    const previous = saved;
    setData(saved?.filter((entry) => entry._id !== item._id)); // optimistic
    try {
      await userApi.unsave(item);
    } catch (caught) {
      setData(previous);
      setError(caught instanceof Error ? caught.message : "Could not remove this plumber.");
    }
  };

  return (
    <>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}
      {!saved?.length ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <FaHeart className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-gray-500">You haven&apos;t saved any plumbers yet. Use the Save button on a plumber&apos;s profile.</p>
          <Link href="/find" className="mt-4 inline-block rounded-full bg-[#FFD60A] px-6 py-2 text-sm font-semibold text-[#0b1f3b] transition hover:brightness-105">
            Browse Plumbers
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((item) => (
            <div key={item._id} className="group relative rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
              <button type="button" onClick={() => remove(item)} className="absolute right-3 top-3 z-10 text-gray-400 transition hover:text-red-500" aria-label={`Remove ${item.name} from saved`}>
                <FaTrashAlt className="h-4 w-4" />
              </button>
              <Link href={`/plumber/${item.providerId}`}>
                <div className="flex items-center gap-3 pr-6">
                  {/* eslint-disable-next-line @next/next/no-img-element -- snapshot images come from any allowed host */}
                  <img src={item.image || "/Plumber.png"} alt="" className="h-16 w-16 shrink-0 rounded-full bg-gray-100 object-cover" />
                  <div className="min-w-0">
                    <h3 className="line-clamp-1 font-semibold text-gray-900">{item.name}</h3>
                    {item.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <FaStar className="h-3 w-3 text-[#FFD60A]" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        {item.reviewCount !== undefined && <span className="text-xs text-gray-500">({item.reviewCount})</span>}
                      </div>
                    )}
                    {item.location && <p className="truncate text-xs text-gray-500">{item.location}</p>}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  {item.priceRange && <span className="text-sm font-bold text-[#b39200]">{item.priceRange}</span>}
                  {item.discount && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      <FaTag className="h-2 w-2" />
                      {item.discount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
