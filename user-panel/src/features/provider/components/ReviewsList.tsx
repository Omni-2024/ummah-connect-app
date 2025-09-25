import { Card } from "@/components/base/Card";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

interface ReviewsListProps {
  reviewsData: any;
  isReviewLoading: boolean;
  isReviewError: boolean;
  buildAvatarUrl: (url?: string | null) => string | null;
}

export default function ReviewsList({
  reviewsData,
  isReviewLoading,
  isReviewError,
  buildAvatarUrl,
}: ReviewsListProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFilledIcon key={i} className="size-4 text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="size-4 text-yellow-500" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="size-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="space-y-4">
      {isReviewLoading ? (
        [1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="size-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 w-1/3 rounded" />
                <div className="h-4 bg-gray-200 w-2/3 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))
      ) : isReviewError ? (
        <Card className="p-6">
          <p className="text-red-600">Failed to load reviews.</p>
        </Card>
      ) : reviewsData?.data?.length ? (
        reviewsData.data.map((r: any) => (
          <Card key={r.id} className="p-6">
            <div className="flex gap-4">
              {r.userImageUrl ? (
                <img
                  src={buildAvatarUrl(r.userImageUrl) || "/images/default-avatar.png"}
                  alt={r.userName ?? "User"}
                  className="size-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="size-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(r.userName ?? "U").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{r.userName ?? "Anonymous"}</h4>
                    <p className="text-sm text-gray-500">
                      {(r.userName ?? "Unknown")} • {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(r.stars)}
                    <span className="text-sm font-medium ml-1">{r.stars.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{r.description}</p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No reviews yet.</p>
        </Card>
      )}
    </div>
  );
}
