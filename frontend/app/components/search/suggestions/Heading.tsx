"use client";

import { type ReactNode } from "react";

export const Heading = ({ children, aside }: { children: ReactNode; aside?: ReactNode }) => (
  <li role="presentation" className="flex items-center justify-between px-3 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
    <span>{children}</span>{aside}
  </li>
);
