"use client";

import { Card } from "@/components/base/Card";
import ReviewCard from "@/features/explore/component/reviews/ReviewCard"; 
import React from "react";

interface ReviewsListProps {
  reviewsData: any;
  isReviewLoading: boolean;
  isReviewError: boolean;
  buildAvatarUrl: (url?: string | null) => string | null;
  starFilter: number | number[]; // Support both for backward compatibility
  searchQuery?: string; // Optional prop for highlighting
}

export default function ReviewsList({
  reviewsData,
  isReviewLoading,
  isReviewError,
  starFilter,
  searchQuery = "",
}: ReviewsListProps) {
  // Normalize starFilter to an array
  const normalizedStarFilter = Array.isArray(starFilter)
    ? starFilter
    : starFilter === 0
    ? []
    : [starFilter].filter((s): s is number => typeof s === "number");

  // Filter reviews based on selected star ratings
  const filteredReviews = normalizedStarFilter.length
    ? reviewsData?.data?.filter((r: any) => normalizedStarFilter.includes(Math.floor(r.stars))) || []
    : reviewsData?.data || [];

  return (
    <div className="space-y-3">
      {isReviewLoading ? (
        [1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="size-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 w-1/4 rounded" />
                <div className="h-3 bg-gray-200 w-1/2 rounded" />
                <div className="h-3 bg-gray-200 w-3/4 rounded" />
              </div>
            </div>
          </Card>
        ))
      ) : isReviewError ? (
        <Card className="p-4">
          <p className="text-red-600 text-sm">Failed to load reviews.</p>
        </Card>
      ) : filteredReviews.length ? (
        filteredReviews.map((review: any) => (
          // ✅ Use your reusable ReviewCard here
          <ReviewCard key={review.id} review={review} searchQuery={searchQuery} />
        ))
      ) : (
        <Card className="p-4 text-center">
          <p className="text-gray-500 text-sm">No reviews match the selected filters.</p>
        </Card>
      )}
    </div>
  );
}
