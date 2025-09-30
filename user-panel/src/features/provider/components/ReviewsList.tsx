import { Card } from "@/components/base/Card";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

interface ReviewsListProps {
  reviewsData: any;
  isReviewLoading: boolean;
  isReviewError: boolean;
  buildAvatarUrl: (url?: string | null) => string | null;
  starFilter: number | number[]; // Support both for backward compatibility
}

export default function ReviewsList({
  reviewsData,
  isReviewLoading,
  isReviewError,
  buildAvatarUrl,
  starFilter,
}: ReviewsListProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFilledIcon key={`full-${i}`} className="size-4 text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="size-4 text-yellow-500 opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="size-4 text-gray-300" />);
    }

    return stars;
  };

  // Normalize starFilter to an array
  const normalizedStarFilter = Array.isArray(starFilter)
    ? starFilter
    : starFilter === 0
    ? []
    : [starFilter].filter((s): s is number => typeof s === "number");

  // Filter reviews based on multiple star ratings
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
        filteredReviews.map((r: any) => (
          <Card key={r.id} className="p-4">
            <div className="flex gap-3">
              {r.userImageUrl ? (
                <img
                  src={buildAvatarUrl(r.userImageUrl) || "/images/default-avatar.png"}
                  alt={r.userName ?? "User"}
                  className="size-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="size-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(r.userName ?? "U").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h4 className="font-semibold text-sm">{r.userName ?? "Anonymous"}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(r.stars)}
                    <span className="text-xs font-medium">{r.stars.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{r.description}</p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-4 text-center">
          <p className="text-gray-500 text-sm">No reviews match the selected filters.</p>
        </Card>
      )}
    </div>
  );
}