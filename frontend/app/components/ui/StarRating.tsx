import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 14 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} size={size} className="text-[#FFD60A]" />
      ))}
      {hasHalfStar && <FaStarHalfAlt size={size} className="text-[#FFD60A]" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} size={size} className="text-gray-300" />
      ))}
    </div>
  );
}