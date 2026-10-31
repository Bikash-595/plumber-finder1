import type { ReactNode } from "react";

/** White card used for every section of the customer dashboard, with an optional title row and action link. */
export default function Panel({ title, description, action, children, className = "", bodyClassName = "p-5 sm:p-6" }: { title?: ReactNode; description?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={`min-w-0 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold text-gray-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
