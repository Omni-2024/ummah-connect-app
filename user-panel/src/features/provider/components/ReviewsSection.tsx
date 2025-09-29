import { Card } from "@/components/base/Card";
import { ReviewsPagination } from "@/features/explore/component/ReviewsPagination";
import ReviewsFilter from "./ReviewsFilter";
import ReviewsList from "./ReviewsList";

interface ReviewsSectionProps {
  reviewsData: any;
  isReviewLoading: boolean;
  isReviewError: boolean;
  starFilter: number[]; // ✅ Updated: supports multiple filters
  setStarFilter: (stars: number[]) => void; // ✅ Updated: accepts array
  pageLimit: number;
  pageOffset: number;
  setPageOffset: (offset: number) => void;
  buildAvatarUrl: (url?: string | null) => string | null;
}

export default function ReviewsSection({
  reviewsData,
  isReviewLoading,
  isReviewError,
  starFilter,
  setStarFilter,
  pageLimit,
  pageOffset,
  setPageOffset,
  buildAvatarUrl,
}: ReviewsSectionProps) {
  return (
    <div className="space-y-6">
      <ReviewsFilter
        totalReviews={reviewsData?.meta?.total ?? 0}
        starFilter={starFilter}
        setStarFilter={setStarFilter}
        setPageOffset={setPageOffset}
      />
      <ReviewsList
        reviewsData={reviewsData}
        isReviewLoading={isReviewLoading}
        isReviewError={isReviewError}
        buildAvatarUrl={buildAvatarUrl}
        starFilter={starFilter} // ✅ Pass filter array
      />
      <ReviewsPagination
        total={reviewsData?.meta?.total ?? 0}
        limit={pageLimit}
        offset={pageOffset}
        onPageChange={(nextOffset) => setPageOffset(nextOffset)}
      />
    </div>
  );
}
