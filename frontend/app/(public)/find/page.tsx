"use client";

import { Suspense } from "react";
import FindPlumberPageForUrl from "@/components/find/find-page/FindPlumberPageForUrl";

export default function FindPlumberPageWrapper() {
  return (
    <Suspense>
      <FindPlumberPageForUrl />
    </Suspense>
  );
}
