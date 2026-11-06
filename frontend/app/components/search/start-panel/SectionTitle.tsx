"use client";

import { type ReactNode } from "react";

export const SectionTitle = ({ icon, children, action }: { icon: ReactNode; children: ReactNode; action?: ReactNode }) => (
  <div className="mb-2.5 flex items-center justify-between gap-2">
    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{icon}{children}</p>
    {action}
  </div>
);
