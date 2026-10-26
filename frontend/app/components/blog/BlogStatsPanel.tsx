"use client";

import { useEffect, useState } from "react";
import { FaCommentDots, FaEye, FaThumbsUp, FaUsers } from "react-icons/fa";
import { apiRequest } from "@/components/utils/apiClient";
import { formatCount } from "./useBlogViews";

type Row = { _id: string; title: string; status: "draft" | "published"; publishDate?: string; views: number; readers: number; signedInReaders: number; likes: number; dislikes: number; comments: number };
type Totals = { views: number; readers: number; likes: number; comments: number };

/** A company's or freelancer's blog numbers: total views, readers, likes, comments, and each article's, most read first. */
export default function BlogStatsPanel({ refreshKey = 0 }: { refreshKey?: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  useEffect(() => {
    apiRequest<Row[]>("/blogs/stats/mine").then((payload) => { setRows(payload.data); setTotals(payload.totals as Totals); }).catch(() => setRows([]));
  }, [refreshKey]);
  if (!rows?.length || !totals) return null;
  const cards = [
    { label: "Views", value: totals.views, icon: FaEye, hint: "Times your articles were opened" },
    { label: "Readers", value: totals.readers, icon: FaUsers, hint: "Different people who read them" },
    { label: "Likes", value: totals.likes, icon: FaThumbsUp, hint: "Readers who found them helpful" },
    { label: "Comments", value: totals.comments, icon: FaCommentDots, hint: "Comments and replies" },
  ];
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 p-4 sm:p-5">
      <h3 className="text-sm font-bold text-gray-900">Blog performance</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="rounded-xl bg-gray-50 p-3" title={hint}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500"><Icon className="h-3 w-3 text-[#f7672c]" aria-hidden /> {label}</p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">{formatCount(value)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead><tr className="text-xs uppercase tracking-wide text-gray-500"><th className="py-2 pr-3 font-semibold">Article</th><th className="px-3 py-2 text-right font-semibold">Views</th><th className="px-3 py-2 text-right font-semibold">Readers</th><th className="px-3 py-2 text-right font-semibold">Likes</th><th className="py-2 pl-3 text-right font-semibold">Comments</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row._id}>
                <td className="py-2 pr-3"><p className="font-medium text-gray-900">{row.title}</p>{row.status !== "published" && <p className="text-xs text-gray-400">Draft — not public</p>}</td>
                <td className="px-3 py-2 text-right font-semibold text-gray-900">{row.views.toLocaleString()}</td>
                <td className="px-3 py-2 text-right text-gray-700" title={`${row.signedInReaders} signed in`}>{row.readers.toLocaleString()}</td>
                <td className="px-3 py-2 text-right text-gray-700">{row.likes.toLocaleString()}{row.dislikes ? <span className="text-xs text-gray-400"> / {row.dislikes} 👎</span> : null}</td>
                <td className="py-2 pl-3 text-right text-gray-700">{row.comments.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
