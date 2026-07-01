import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  showValue = true,
  reviewCount,
  className,
}: StarRatingProps) {
  const sizeMap = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };
  const textMap = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(sizeMap[size], filled || partial ? "fill-amber-400 text-amber-400" : "text-gray-300")}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-foreground", textMap[size])}>{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", textMap[size])}>
          ({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(reviewCount >= 100000 ? 0 : 1)}K` : reviewCount})
        </span>
      )}
    </div>
  );
}
