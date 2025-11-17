"use client"

import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import Bottombar from "@/features/app/components/Bottombar"
import { Card } from "@/components/base/Card"
import Button from "@/components/base/Button"
import Badge from "@/components/base/Badge"
import IconButton from "@/components/base/IconButton"
import { ArrowLeftIcon, CalendarIcon, StarIcon, StarFilledIcon } from "@radix-ui/react-icons"
import { UserRole } from "@/lib/constants"
import withAuth from "@/components/withAuth"
import Footer from "@/features/app/components/Footer"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { useAuthState } from "@/features/auth/context/useAuthState"
import envs from "@/lib/env"
import { usePaymentsByUser } from "@/lib/hooks/usePayments"
import { generateSlug } from "@/lib/helpers/strings"
import { createReview, updateReview, viewReviewByUserAndServiceId } from "@/lib/endpoints/reviewFns"
import { isAxiosError } from "axios"
import type { Review } from "@/lib/endpoints/reviewFns" // Adjust path as needed

// Helper function to build avatar URL
export const buildAvatarUrl = (img?: string | null): string | null => {
  if (!img) return null
  if (/^https?:\/\//i.test(img)) return img
  const base = envs.imageBaseUrl
  return `${base}/${img}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getStatusBadge(status: string) {
  switch (status) {
    case "succeeded":
      return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>
    case "failed":
      return <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>
    default:
      return null
  }
}

// Star Rating Component
interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, interactive = true }) => {
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
            className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
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

// Review Section Component
interface ReviewSectionProps {
  serviceId: string
  status: string
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ serviceId, status }) => {
  const { data: user } = useCurrentUser()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false)
  const [submittedReview, setSubmittedReview] = useState<Review | null>(null)

  const fetchReview = async () => {
    if (!user?.id) return
    try {
      const review = await viewReviewByUserAndServiceId({ userId: user.id, serviceId })
      setSubmittedReview(review)
      setHasSubmittedReview(true)
      setRating(review.stars)
      setReviewText(review.description)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        setSubmittedReview(null)
        setHasSubmittedReview(false)
        setRating(0)
        setReviewText('')
      } else {
        console.error('Failed to fetch review:', error)
      }
    }
  }

  useEffect(() => {
    fetchReview()
  }, [user?.id, serviceId])

  const handleSubmitReview = async () => {
    if (!user?.id) {
      alert('User not authenticated')
      return
    }
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    if (reviewText.trim().length < 10) {
      alert('Please write at least 10 characters')
      return
    }

    setIsSubmitting(true)
    
    try {
      let updatedReview: Review
      if (hasSubmittedReview && submittedReview) {
        // Update existing review
        updatedReview = await updateReview({
          id: submittedReview.id,
          description: reviewText,
          stars: rating,
        })
      } else {
        // Create new review
        updatedReview = await createReview({
          serviceId,
          userId: user.id,
          description: reviewText,
          stars: rating,
        })
      }
      
      setSubmittedReview(updatedReview)
      setHasSubmittedReview(true)
      setShowReviewForm(false)
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReview = () => {
    if (submittedReview) {
      setRating(submittedReview.stars)
      setReviewText(submittedReview.description)
    }
    setShowReviewForm(true)
  }

  const handleCancel = () => {
    setShowReviewForm(false)
    if (hasSubmittedReview && submittedReview) {
      setRating(submittedReview.stars)
      setReviewText(submittedReview.description)
    } else {
      setRating(0)
      setReviewText('')
    }
  }

  // Only show review section for completed purchases
  if (status !== "succeeded") {
    return null
  }

  return (
    <div className="mt-4 pt-4 border-none">
      {/* Existing Review Display */}
      {hasSubmittedReview && submittedReview && !showReviewForm ? (
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
            <StarRating rating={submittedReview.stars} interactive={false} />
            <span className="text-sm text-gray-600">
              {submittedReview.stars}.0 out of 5
            </span>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {submittedReview.description}
          </p>
          <p className="text-xs text-gray-500">
            Reviewed on {formatDate(submittedReview.createdAt)}
          </p>
        </div>
      ) : showReviewForm ? (
        /* Review Form */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              {hasSubmittedReview ? 'Edit Your Review' : 'Write a Review'}
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
                <span className="text-sm text-gray-600 font-medium">
                  {rating}.0 out of 5
                </span>
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {reviewText.length}/500 characters
              </span>
              <span className="text-xs text-gray-500">
                Minimum 10 characters
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
            {isSubmitting ? 'Submitting...' : hasSubmittedReview ? 'Update Review' : 'Submit Review'}
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

const MyPurchasesPage = () => {
  const router = useRouter()
  const { data: user } = useCurrentUser()
  const { logout } = useAuthState()
  const [selectedTab, setSelectedTab] = useState<"all" | "succeeded" | "pending" | "failed">("all")
  const [avatarBroken, setAvatarBroken] = useState(false)

  const avatarUrl = buildAvatarUrl(user?.profileImage)

  // Use React Query hook - it will only run when user?.id exists
  const { data: paymentsResponse, isLoading, error } = usePaymentsByUser(
    user?.id || "",
    100,
    0
  )

  const purchases = Array.isArray(paymentsResponse?.data)
    ? paymentsResponse.data
    : [];

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  // Filter purchases based on selected tab
  const filteredPurchases = selectedTab === "all"
    ? purchases
    : purchases.filter((purchase) => purchase.status === selectedTab)

  const handleBack = () => {
    router.back()
  }

  const handleViewService = (serviceName: string) => {
    // Generate slug from service name only (backend handles lookup by slug)
    const slug = generateSlug(serviceName)
    router.push(`/service/${slug}`)
  }

  // Show loading state while fetching user or payments
  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="My Purchases" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-4 lg:px-20 lg:py-10">
          {/* Header Skeleton */}
          <div className="mb-6 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 w-64 bg-gray-200 rounded"></div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="px-6 pt-5 pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-9 flex-1 bg-gray-200 rounded"></div>
                    <div className="h-9 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Bottombar
          user={user}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="My Purchases" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-gray-600 mb-6">Failed to load purchases. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Bottombar
          user={user}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="My Purchases" size="md" />
          </div>
        }
      />

      <div className="container px-4 py-4 lg:px-20 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Purchases</h1>
          <p className="text-gray-600">Manage your purchased services</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {[
            { key: "all", label: "All", count: purchases.length },
            { key: "succeeded", label: "Completed", count: purchases.filter((p) => p.status === "succeeded").length },
            { key: "pending", label: "Pending", count: purchases.filter((p) => p.status === "pending").length },
            { key: "failed", label: "Failed", count: purchases.filter((p) => p.status === "failed").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTab === tab.key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Purchases Grid */}
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services found</h3>
            <Button onClick={() => router.push("/explore")}>
              Explore Services
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredPurchases.map((purchase) => (
              <Card
                key={purchase.paymentIntent}
                className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-primary-300 transition-all duration-300 overflow-hidden group"
              >               
                {/* Status Badge */}
                <div className="relative px-6 pt-5 pb-2">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(purchase.status)}
                    <div className="text-xl font-bold text-gray-900">
                      ${(purchase.amount / 100).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div className="px-6 pb-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {purchase.serviceName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <CalendarIcon className="size-4" />
                      <span>{formatDate(purchase.createdAt)}</span>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  {purchase.last4 && (
                    <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-medium text-gray-700">
                        {purchase.paymentMethod} •••• {purchase.last4}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewService(purchase.serviceName)}
                      variant="primary"
                      className="flex-1"
                      size="sm"
                    >
                      View Service
                    </Button>
                    {purchase.receiptUrl && (
                      <Button
                        onClick={() => window.open(purchase.receiptUrl, '_blank')}
                        variant="primary"
                        size="sm"
                      >
                        Receipt
                      </Button>
                    )}
                  </div>

                  {/* REVIEW SECTION - ADDED HERE */}
                  <ReviewSection 
                    serviceId={purchase.serviceId} // Assume serviceId is available in purchase object from backend
                    status={purchase.status}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {purchases.length > 0 && (
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{purchases.length}</div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {purchases.filter((p) => p.status === "succeeded").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">
                ${(purchases.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        )}
      </div>

      <Bottombar
        user={user}
        avatarUrl={avatarUrl}
        avatarBroken={avatarBroken}
        setAvatarBroken={setAvatarBroken}
        handleLogout={handleLogout}
      />
      <Footer />
    </div>
  )
}

export default withAuth(MyPurchasesPage, [UserRole.USER])