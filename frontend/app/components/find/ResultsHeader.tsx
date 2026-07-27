import { FaTh, FaList } from "react-icons/fa";

interface ResultsHeaderProps {
  totalResults: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function ResultsHeader({ totalResults, viewMode, onViewModeChange }: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-gray-600">

        {/* <span className="font-semibold text-gray-900">{totalResults}</span> */}
         {/* plumbers found */}

      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`rounded-lg p-2 transition ${viewMode === "grid" ? "bg-[#FFD60A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <FaTh className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`rounded-lg p-2 transition ${viewMode === "list" ? "bg-[#FFD60A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <FaList className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}