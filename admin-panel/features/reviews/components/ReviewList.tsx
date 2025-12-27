"use client";

import { useState, useEffect } from "react";
import { useReviewByProvider, useReviewByService } from "@/hooks/useReviews";
import ReviewCard from "./ReviewCard";
import ReviewCardSkeleton from "../skeleton/ReviewCardSkeleton";
import AdvancedPagination from "@/components/widget/advancedPagination";

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

export default function ReviewList({
  filterType,
  query,
  setQuery,
}: ReviewListProps) {
  const PAGE_SIZE = query.limit;

  const [sortOrder, setSortOrder] = useState<"high" | "low">("low");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // page is derived from offset (same pattern as users page)
  const [page, setPage] = useState(
    Math.floor(query.offset / PAGE_SIZE) + 1
  );

  /* -----------------------------------------
     DATA FETCH
  ------------------------------------------ */
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

  /* -----------------------------------------
     SYNC PAGE → OFFSET (same as users page)
  ------------------------------------------ */
  useEffect(() => {
    setQuery({
      ...query,
      offset: (page - 1) * PAGE_SIZE,
    });
  }, [page]);

  /* -----------------------------------------
     AUTO FIX PAGE WHEN EMPTY
  ------------------------------------------ */
  const totalPages = Math.max(
    1,
    Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE)
  );

  useEffect(() => {
    if ((data?.data?.length ?? 0) === 0 && page > 1) {
      setPage((prev) => Math.min(prev - 1, totalPages));
    }
  }, [data?.data?.length, page, totalPages]);

  /* -----------------------------------------
     LOADING / ERROR / EMPTY STATES
  ------------------------------------------ */
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
        Error fetching reviews{" "}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </p>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex justify-center mt-16">
        <div className="p-6 w-full max-w-md text-center border border-border/50 bg-gradient-to-r from-slate-50 to-white rounded-2xl">
          <p className="text-primary text-lg font-semibold">
            No reviews available
          </p>
          <p className="text-primary-600 text-sm mt-1">
            This freelancer has no reviews yet.
          </p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     SORTING
  ------------------------------------------ */
  const sortedReviews = [...data.data].sort((a, b) =>
    sortOrder === "high" ? b.stars - a.stars : a.stars - b.stars
  );

  /* -----------------------------------------
     UI
  ------------------------------------------ */
  return (
    <div className="space-y-4 relative">
      {/* === SORT DROPDOWN === */}
      <div className="flex justify-end">
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
            onDeleted={refetch}
          />
        ))}
      </div>

      {/* === ADVANCED PAGINATION (SAME AS USERS PAGE) === */}
      {data?.meta?.total > PAGE_SIZE && (
        <AdvancedPagination
          currentPage={page}
          totalPages={Math.ceil(data.meta.total / PAGE_SIZE)}
          onChange={setPage}
        />
      )}
    </div>
  );
}
