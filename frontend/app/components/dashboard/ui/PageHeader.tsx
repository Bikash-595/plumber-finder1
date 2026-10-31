import type { ReactNode } from "react";
import type { IconType } from "react-icons";

/** Title row at the top of every customer dashboard page: icon, title, one-line description, and actions on the right. */
export default function PageHeader({ title, description, icon: Icon, actions }: { title: string; description?: ReactNode; icon?: IconType; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b1f3b] text-[#FFD60A] shadow-sm sm:flex">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-600 sm:text-base">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
