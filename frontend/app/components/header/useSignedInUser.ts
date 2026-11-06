"use client";

import { useEffect, useState } from "react";
import { readStoredUser, type AppUser } from "@/components/utils/auth";

/** The signed-in account (from storage), kept in sync across tabs and when the window regains focus. */
export function useSignedInUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  useEffect(() => {
    const sync = () => setUser(readStoredUser());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);
  return [user, setUser] as const;
}
