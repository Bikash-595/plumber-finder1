"use client";

import { useEffect, type RefObject } from "react";

/** Calls `onDismiss` on Escape, and on a click outside `ref` (when given), while `active`. */
export function useDismiss(active: boolean, onDismiss: () => void, ref?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const onClick = (event: MouseEvent) => { if (ref?.current && !ref.current.contains(event.target as Node)) onDismiss(); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onDismiss(); };
    if (ref) document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, onDismiss, ref]);
}
