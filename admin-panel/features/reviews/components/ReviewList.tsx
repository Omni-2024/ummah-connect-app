"use client";

import { useReviewByProvider, useReviewByService } from "@/hooks/useReviews";
import ReviewCard from "./ReviewCard";
import Pagination from "./Pagination";

// Filter type
export type FilterType = "service" | "provider";

// Query type
export type ReviewQuery = {
  stars: number;
  limit: number;
  offset: number;
} & (
  | { serviceId: string; providerId?: undefined }
  | { providerId: string; serviceId?: undefined }
);

// Props type
type ReviewListProps = {
  filterType: FilterType;
  query: ReviewQuery;
  setQuery: (q: ReviewQuery) => void;
};

export default function ReviewList({ filterType, query, setQuery }: ReviewListProps) {
  // Only fetch service reviews if serviceId exists
  const queryService = useReviewByService(
    {
      serviceId: query.serviceId || "",
      stars: query.stars,
      limit: query.limit,
      offset: query.offset,
    } as any,
    { enabled: filterType === "service" && !!query.serviceId }
  );

  // Only fetch provider reviews if providerId exists
  const queryProvider = useReviewByProvider(
    {
      providerId: query.providerId || "",
      stars: query.stars,
      limit: query.limit,
      offset: query.offset,
    } as any,
    { enabled: filterType === "provider" && !!query.providerId }
  );

  // Determine which query to use
  const active = filterType === "service" ? queryService : queryProvider;
  const { data, isLoading, isError, refetch } = active;

  // Loading state
  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">Loading reviews...</p>;
  }

  // Error state
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

  // No reviews for selected provider
  if (!data?.data || data.data.length === 0) {
    return <p className="text-center text-gray-500 py-10">No reviews found for this provider.</p>;
  }

  return (
    <div>
      <div className="grid gap-4">
        {data.data.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <Pagination meta={data.meta} query={query} setQuery={setQuery} />
    </div>
  );
}
