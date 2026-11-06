"use client";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface SectionProps {
  title: string;
  sectionKey: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: (section: string) => void;
}

export default function Section({ title, sectionKey, children, open, onToggle }: SectionProps) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <button
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between py-1 font-semibold text-gray-900"
      >
        {title}
        {open ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}
