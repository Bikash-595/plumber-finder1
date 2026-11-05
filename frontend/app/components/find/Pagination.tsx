import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** 1 … 4 5 [6] 7 8 … 334 — at most 9 buttons however many pages there are (thousands of plumbers stay one row). */
function visiblePages(current: number, total: number): (number | "gap")[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(current - 2, total - 5));
  const end = Math.min(total - 1, Math.max(current + 2, 6));
  return [1, ...(start > 2 ? ["gap" as const] : []), ...Array.from({ length: end - start + 1 }, (_, i) => start + i), ...(end < total - 1 ? ["gap" as const] : []), total];
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const pages = visiblePages(currentPage, totalPages);

  return (
    <nav aria-label="Pages" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="rounded-full border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page, index) =>
        page === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-sm text-gray-400" aria-hidden>…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              page === currentPage
                ? "bg-[#FFD60A] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="rounded-full border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
