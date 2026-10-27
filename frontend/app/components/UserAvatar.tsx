"use client";

import { useState } from "react";
import { getInitials } from "@/components/utils/auth";

/**
 * A person's round profile photo, or their initials. Photos can come from anywhere (Google, Apple,
 * an upload, a link), so this uses a plain <img> instead of next/image (which only allows configured hosts).
 * If the photo fails to load, the initials show instead.
 */
export default function UserAvatar({ name, src, size, className = "" }: { name: string; src?: string | null; size: number; className?: string }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size };
  if (src && !broken) {
    // eslint-disable-next-line @next/next/no-img-element -- avatar hosts vary (Google, uploads); see above
    return <img src={src} alt={name} width={size} height={size} style={style} referrerPolicy="no-referrer" onError={() => setBroken(true)} className={`shrink-0 rounded-full object-cover ${className}`} />;
  }
  return (
    <span style={{ ...style, fontSize: Math.max(10, Math.round(size * 0.38)) }} className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#0b1f3b] font-bold text-white ${className}`} aria-label={name}>
      {getInitials(name) || name.charAt(0).toUpperCase()}
    </span>
  );
}
