import React, { useState, useEffect } from "react"
import { StarIcon } from "@radix-ui/react-icons"
import { isAxiosError } from "axios"
import Button from "@/components/base/Button"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { createReview, updateReview, viewReviewByUserAndServiceId } from "@/lib/endpoints/reviewFns"
import type { Review } from "@/lib/endpoints/reviewFns"
import { StarRating } from "./StarRating"

interface ReviewSectionProps {
  serviceId: string
  status: string,
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ serviceId, status }) => {
  const { data: user } = useCurrentUser()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // This is the key: properly track if a review exists
  const [existingReview, setExistingReview] = useState<Review | null>(null)

  const fetchReview = async () => {
    if (!user?.id) return

    try {
      const review = await viewReviewByUserAndServiceId({ userId: user.id, serviceId })
      setExistingReview(review)
      setRating(review.stars)
      setReviewText(review.description)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        // No review exists → clean state
        setExistingReview(null)
        setRating(0)
        setReviewText("")
      } else {
        console.error("Failed to fetch review:", error)
      }
    }
  }

  useEffect(() => {
    if (status === "succeeded") {
      fetchReview()
    }
  }, [user?.id, serviceId, status])

  const handleSubmitReview = async () => {
    if (!user?.id) return alert("User not authenticated")
    if (rating === 0) return alert("Please select a rating")
    if (reviewText.trim().length < 10) return alert("Please write at least 10 characters")

    setIsSubmitting(true)

    try {
      let updatedReview: Review

      if (existingReview) {
        // Update existing
        updatedReview = await updateReview({
          id: existingReview.id,
          description: reviewText,
          stars: rating,
        })
      } else {
        updatedReview = await createReview({
          serviceId,
          userId: user.id,
          description: reviewText,
          stars: rating,
        })
      }

      setExistingReview(updatedReview)
      setShowReviewForm(false)
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReview = () => {
    setShowReviewForm(true)
  }

  const handleCancel = () => {
    setShowReviewForm(false)
    if (existingReview) {
      setRating(existingReview.stars)
      setReviewText(existingReview.description)
    } else {
      setRating(0)
      setReviewText("")
    }
  }

  // Don't render anything until service is succeeded
  if (status !== "succeeded") return null

  // Main render logic
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* Case 1: User has already submitted a review */}
      {existingReview && !showReviewForm ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Your Review</h4>
            <button
              onClick={handleEditReview}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Edit
            </button>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={existingReview.stars} interactive={false} />
            <span className="text-sm text-gray-600">{existingReview.stars} out of 5</span>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {existingReview.description}
          </p>
          <p className="text-xs text-gray-500">
            Reviewed on {formatDate(existingReview.createdAt)}
          </p>
        </div>
      ) : showReviewForm ? (
        /* Review Form */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              {existingReview ? "Edit Your Review" : "Write a Review"}
            </h4>
            <button
              onClick={handleCancel}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-3">
              <StarRating rating={rating} onRatingChange={setRating} />
              {rating > 0 && (
                <span className="text-sm text-gray-600 font-medium">{rating} out of 5</span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this service..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
              // maxLength removed → unlimited length
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">
                Minimum 10 characters ({reviewText.length} written)
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitReview}
            disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
            variant="primary"
            className="w-full"
            size="sm"
          >
            {isSubmitting
              ? "Submitting..."
              : existingReview
              ? "Update Review"
              : "Submit Review"}
          </Button>
        </div>
      ) : (
        /* Add Review Button */
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition-all text-sm font-medium flex items-center justify-center gap-2"
        >
          <StarIcon className="w-4 h-4" />
          Write a Review
        </button>
      )}
    </div>
  )
}