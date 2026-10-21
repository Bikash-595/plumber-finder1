"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { FaLock } from "react-icons/fa";
import { readStoredUser } from "@/components/utils/auth";

const subscribe = (onChange: () => void) => { window.addEventListener("storage", onChange); return () => window.removeEventListener("storage", onChange); };
// Signed-in account type ("" for guests). Read as an external store so server and first client render match.
const signedInAccountType = () => (readStoredUser()?.accessToken ? readStoredUser()?.accountType ?? "seeker" : "");

/** Shown on customer pages to guests, and to company/freelancer accounts (which have their own dashboards). */
export default function SignInPrompt({ what = "this page" }: { what?: string }) {
  const accountType = useSyncExternalStore(subscribe, signedInAccountType, () => "");
  const otherAccount = accountType !== "" && accountType !== "seeker";
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FFD60A]/15 text-[#0b1f3b]">
        <FaLock className="h-5 w-5" aria-hidden />
      </span>
      <h2 className="mt-4 text-xl font-bold text-gray-900">{otherAccount ? "Customer accounts only" : "Please log in"}</h2>
      <p className="mt-2 text-sm text-gray-600">
        {otherAccount ? `You are signed in as a ${accountType}. Log in with a customer account to see ${what}.` : `Log in or create a free customer account to see ${what}.`}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/login" className="rounded-full bg-[#0b1f3b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17345a]">Log in</Link>
        <Link href="/signup" className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50">Sign up</Link>
      </div>
    </div>
  );
}
