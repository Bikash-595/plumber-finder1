"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/components/utils/apiClient";
import { readStoredUser } from "@/components/utils/auth";
import { visitorId } from "@/components/utils/visitor";

export type BlogViews = { views: number; readers: number };
// One request per post per page load, shared by every component showing the numbers.
const recorded = new Map<string, Promise<BlogViews | null>>();

function record(postPath: string) {
  if (!recorded.has(postPath)) {
    const token = readStoredUser()?.accessToken;
    recorded.set(postPath, fetch(`${API_BASE_URL}/blogs/posts/${postPath}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ visitorId: token ? undefined : visitorId() }),
    }).then((response) => (response.ok ? response.json() : null)).then((payload) => (payload?.data ? { views: payload.data.views, readers: payload.data.readers } : null)).catch(() => null));
  }
  return recorded.get(postPath)!;
}

/** Counts this read of the post (once per page load) and returns its live views and readers. */
export function useBlogViews(postPath: string | null): BlogViews | null {
  const [views, setViews] = useState<BlogViews | null>(null);
  useEffect(() => {
    if (!postPath) return;
    let live = true;
    record(postPath).then((result) => { if (live && result) setViews(result); });
    return () => { live = false; };
  }, [postPath]);
  return views;
}

export const formatCount = (value: number) => (value >= 10_000 ? `${(value / 1000).toFixed(value >= 100_000 ? 0 : 1)}k` : value.toLocaleString());
