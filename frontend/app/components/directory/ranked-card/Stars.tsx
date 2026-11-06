import { FaStar } from "react-icons/fa";

export default function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => <FaStar key={n} className={`h-3.5 w-3.5 ${value >= n - 0.25 ? "text-[#FFB800]" : value >= n - 0.75 ? "text-[#FFB800]/50" : "text-gray-200"}`} />)}
    </span>
  );
}
