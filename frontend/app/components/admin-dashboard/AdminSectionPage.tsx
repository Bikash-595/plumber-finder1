import { ReactNode } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface AdminSectionPageProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminSectionPage({
  title,
  description,
  actions,
  children,
}: AdminSectionPageProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-[#0b1f3b] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FFD60A]">
              Admin Control Panel
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">{actions}</div>
        </div>
      </section>

      {children}
    </div>
  );
}
