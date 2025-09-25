import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";

interface ReviewsFilterProps {
  totalReviews: number;
  starFilter: number;
  setStarFilter: (stars: number) => void;
  setPageOffset: (offset: number) => void;
}

export default function ReviewsFilter({
  totalReviews,
  starFilter,
  setStarFilter,
  setPageOffset,
}: ReviewsFilterProps) {
  const handleFilterChange = (stars: number) => {
    setStarFilter(stars);
    setPageOffset(0); // Reset pagination to first page when filter changes
  };

  const handleResetFilter = () => {
    setStarFilter(0); // Reset to show all reviews
    setPageOffset(0); // Reset pagination
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Reviews</h3>
          <p className="text-gray-600">
            {totalReviews} total review{totalReviews === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Filter by stars:</span>
          {[0, 5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1 rounded border text-sm ${
                starFilter === s
                  ? "bg-primary-500 text-white border-primary-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title={s === 0 ? "All" : `${s} stars`}
            >
              {s === 0 ? "All" : `${s}★`}
            </button>
          ))}
          <Button
            variant="primary"
            size="sm"
            onClick={handleResetFilter}
            disabled={starFilter === 0}
            className="ml-2"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}