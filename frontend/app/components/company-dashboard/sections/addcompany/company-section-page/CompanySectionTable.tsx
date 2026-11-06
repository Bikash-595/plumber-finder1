import { FaArrowRight } from "react-icons/fa";

export type CompanyTable = {
  title: string;
  description: string;
  headers: string[];
  rows: string[][];
};

export default function CompanySectionTable({ table }: { table: CompanyTable }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{table.title}</h2>
          <p className="text-sm text-gray-500">{table.description}</p>
        </div>
        <button className="inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-[#0b1f3b] transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">
          Export
          <FaArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-100">
        <div className="hidden bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500 md:grid md:grid-cols-4">
          {table.headers.map((header) => (
            <div key={header} className="px-4 py-3">
              {header}
            </div>
          ))}
        </div>
        {table.rows.map((row) => (
          <div
            key={row.join("-")}
            className="grid gap-3 border-t border-gray-100 p-4 text-sm md:grid-cols-4 md:items-center"
          >
            {row.map((cell, index) => (
              <div key={`${cell}-${index}`} className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 md:hidden">
                  {table.headers[index]}
                </p>
                <p className={index === 0 ? "font-bold text-gray-900" : "font-semibold text-gray-600"}>
                  {cell}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
