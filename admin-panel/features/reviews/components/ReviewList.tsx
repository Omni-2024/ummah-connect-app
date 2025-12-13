"use client";

import { useState } from "react";
import { useReviewByProvider, useReviewByService } from "@/hooks/useReviews";
import ReviewCard from "./ReviewCard";
import Pagination from "./Pagination";
import ReviewCardSkeleton from "../skeleton/ReviewCardSkeleton";

export type FilterType = "service" | "provider";

export type ReviewQuery = {
  stars: number;
  limit: number;
  offset: number;
} & (
  | { serviceId: string; providerId?: undefined }
  | { providerId: string; serviceId?: undefined }
);

type ReviewListProps = {
  filterType: FilterType;
  query: ReviewQuery;
  setQuery: (q: ReviewQuery) => void;
};

export default function ReviewList({ filterType, query, setQuery }: ReviewListProps) {
  const [sortOrder, setSortOrder] = useState<"high" | "low">("low");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const queryService = useReviewByService(
    {
      serviceId: query.serviceId || "",
      stars: query.stars,
      limit: query.limit,
      offset: query.offset,
    } as any,
    { enabled: filterType === "service" && !!query.serviceId }
  );

  const queryProvider = useReviewByProvider(
    {
      providerId: query.providerId || "",
      stars: query.stars,
      limit: query.limit,
      offset: query.offset,
    } as any,
    { enabled: filterType === "provider" && !!query.providerId }
  );

  const active = filterType === "service" ? queryService : queryProvider;
  const { data, isLoading, isError, refetch } = active;

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-10">
        Error fetching reviews.{" "}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </p>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex justify-center mt-16">
        <div className="p-6 w-full max-w-md text-center hover:shadow-sm transition-all duration-200 border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white rounded-2xl">
          <p className="text-primary text-lg font-semibold">No reviews available</p>
          <p className="text-primary-600 text-sm mt-1">
            This provider has no reviews yet.
          </p>
        </div>
      </div>
    );
  }

  const sortedReviews = [...data.data].sort((a, b) =>
    sortOrder === "high" ? b.stars - a.stars : a.stars - b.stars
  );

  return (
    <div className="space-y-4 relative">

      {/* === SORT DROPDOWN === */}
      <div className="flex justify-end relative">
        <div className="w-72 relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((p) => !p)}
            className="w-full border border-primary-700 rounded-full px-5 py-3 bg-white text-primary-700 
                       text-left font-medium flex justify-between items-center"
          >
            Sort by Rating:
            <span className="ml-2">
              {sortOrder === "high" ? "Highest First" : "Lowest First"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-full z-20 bg-white rounded-3xl shadow-lg border border-primary-700">
              <div
                className="px-4 py-3 cursor-pointer text-primary-700 hover:bg-primary-500 hover:text-white"
                onClick={() => {
                  setSortOrder("low");
                  setDropdownOpen(false);
                }}
              >
                Lowest Rated First
              </div>

              <div
                className="px-4 py-3 cursor-pointer text-primary-700 hover:bg-primary-500 hover:text-white"
                onClick={() => {
                  setSortOrder("high");
                  setDropdownOpen(false);
                }}
              >
                Highest Rated First
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === REVIEWS === */}
      <div className="grid gap-4">
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onDeleted={refetch} // 👈 refresh after delete
          />
        ))}
      </div>

      <Pagination meta={data.meta} query={query} setQuery={setQuery} />
    </div>
  );
}
