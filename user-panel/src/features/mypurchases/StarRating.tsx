import React, { useState } from "react"
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  interactive = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating)
        return (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-all duration-200 ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            {isFilled ? (
              <StarFilledIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <StarIcon className="w-6 h-6 text-gray-300" />
            )}
          </button>
        )
      })}
    </div>
  )
}