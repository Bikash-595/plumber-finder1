"use client";

import { useSearchParams } from "next/navigation";
import FindPlumberPage from "./FindPlumberPage";

// A new search from the header (a new ?search=) starts the page afresh: new query, filters and page 1.
export default function FindPlumberPageForUrl() {
  const searchParams = useSearchParams();
  return <FindPlumberPage key={searchParams.toString()} />;
}
