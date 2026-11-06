"use client";

import { typeBadge, type Comment } from "./engagementApi";

export default function Badge({ comment }: { comment: Comment }) {
  if (comment.deleted) return null;
  if (comment.author.isPostAuthor) return <span className="rounded-full bg-[#0b1f3b] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Author</span>;
  const label = typeBadge[comment.author.type];
  return label ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600">{label}</span> : null;
}
