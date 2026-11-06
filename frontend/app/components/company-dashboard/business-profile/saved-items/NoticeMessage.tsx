"use client";

import { type Notice } from "./useSavedItems";

export default function NoticeMessage({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return <p className={`rounded-lg px-3 py-2 text-sm font-medium ${notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{notice.text}</p>;
}
