/* eslint-disable react-hooks/set-state-in-effect */
// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBell, FaHeart, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { clearStoredUser, readStoredUser, type AppUser, getInitials } from "@/components/utils/auth";

export default function AccountPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = readStoredUser();
    if (!storedUser) router.replace("/login");
    else setUser(storedUser);
  }, [router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-amber-50/40 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-white/95 p-6 shadow-lg ring-1 ring-gray-200/70 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.name} width={88} height={88} className="h-20 w-20 rounded-full object-cover ring-4 ring-amber-100" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white ring-4 ring-amber-100">
                {getInitials(user.name) || user.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">My Account</p>
              <h1 className="mt-2 truncate text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="mt-1 truncate text-gray-600">{user.email}</p>
              <p className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 capitalize">
                Account type: {user.accountType || "seeker"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link href="/saved" className="rounded-2xl border border-gray-200 p-4 text-center transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm">
              <FaHeart className="mx-auto h-6 w-6 text-[#FFD60A]" />
              <span className="mt-2 block font-medium text-gray-900">Saved Deals</span>
            </Link>
            <Link href="/notifications" className="rounded-2xl border border-gray-200 p-4 text-center transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm">
              <FaBell className="mx-auto h-6 w-6 text-[#FFD60A]" />
              <span className="mt-2 block font-medium text-gray-900">Notifications</span>
            </Link>
            <Link href="/checkout" className="rounded-2xl border border-gray-200 p-4 text-center transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm">
              <FaShoppingCart className="mx-auto h-6 w-6 text-[#FFD60A]" />
              <span className="mt-2 block font-medium text-gray-900">Cart</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                clearStoredUser();
                router.replace("/login");
              }}
              className="rounded-2xl border border-red-200 p-4 text-center transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-sm"
            >
              <FaSignOutAlt className="mx-auto h-6 w-6 text-red-500" />
              <span className="mt-2 block font-medium text-red-600">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
