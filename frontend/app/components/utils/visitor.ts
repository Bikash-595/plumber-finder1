"use client";

const VISITOR_KEY = "plumberfinder_visitor";

/**
 * This browser's anonymous id: lets the site count a guest once (as a reader or visitor) without
 * knowing who they are. Undefined when storage is blocked.
 */
export function visitorId(): string | undefined {
  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      window.localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}
