import { FaSearch } from "react-icons/fa";

/** "12 results for “kings”", "Showing results for “kings county”" after a misspelled search, or no exact matches. */
export default function SearchSummary({ query, total, correctedQuery }: { query: string; total: number; correctedQuery: string | null }) {
  return (
    <div className="mb-5 rounded-2xl border border-gray-200 bg-white px-5 py-4" role="status">
      {correctedQuery && (
        <p className="mb-1 text-sm text-gray-700">
          Showing results for <b className="text-[#0b1f3b]">“{correctedQuery}”</b> <span className="text-gray-400">— you searched for “{query}”</span>
        </p>
      )}
      {total > 0 ? (
        <p className="flex items-center gap-2 text-base text-gray-800">
          <FaSearch className="h-3.5 w-3.5 text-gray-400" aria-hidden />
          <span><b>{total.toLocaleString("en-US")}</b> {total === 1 ? "result" : "results"} for <b>“{correctedQuery ?? query}”</b></span>
        </p>
      ) : (
        <div>
          <p className="text-base font-semibold text-gray-900">No exact matches for “{query}”</p>
          <p className="mt-1 text-sm text-gray-500">Try fewer words, a company name, a service such as “drain cleaning”, or a city — or browse the related profiles below.</p>
        </div>
      )}
    </div>
  );
}
