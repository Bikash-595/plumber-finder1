"use client";

import { type ReactNode } from "react";

export default function PreviewBox({ onClick, className, children }: { onClick?: () => void; className: string; children: ReactNode }) {
  return onClick ? <button type="button" onClick={onClick} className={className}>{children}</button> : <div className={className}>{children}</div>;
}
