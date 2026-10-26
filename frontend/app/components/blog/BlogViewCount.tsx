"use client";

import { FaEye } from "react-icons/fa";
import { formatCount, useBlogViews } from "./useBlogViews";

/** "1,204 views · 860 readers" for an article; counts this visit. */
export default function BlogViewCount({ postPath }: { postPath: string }) {
  const counted = useBlogViews(postPath);
  if (!counted) return null;
  return <span className="inline-flex items-center gap-2"><FaEye aria-hidden /> {formatCount(counted.views)} views · {formatCount(counted.readers)} readers</span>;
}
