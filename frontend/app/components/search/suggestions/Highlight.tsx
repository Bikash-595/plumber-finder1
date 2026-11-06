"use client";

import { Fragment, type ReactNode } from "react";

/** Like a shop's search box: what was typed stays plain and the rest of the suggestion is bold. */
export default function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 2);
  if (!words.length) return <span className="font-semibold text-slate-900">{text}</span>;
  const pattern = new RegExp(`\\b(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(<b key={`b${at}`} className="font-semibold text-slate-900">{text.slice(last, at)}</b>);
    parts.push(<mark key={at} className="bg-transparent font-normal text-slate-500">{match[0]}</mark>);
    last = at + match[0].length;
  }
  if (last < text.length) parts.push(<b key="end" className="font-semibold text-slate-900">{text.slice(last)}</b>);
  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>;
}
