import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            page === currentPage
              ? "bg-[#FFD60A] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}