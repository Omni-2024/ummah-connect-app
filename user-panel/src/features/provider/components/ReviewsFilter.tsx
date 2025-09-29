import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";

interface ReviewsFilterProps {
  totalReviews: number;
  starFilter: number | number[]; // Support both for backward compatibility
  setStarFilter: (stars: number[]) => void;
  setPageOffset: (offset: number) => void;
}

export default function ReviewsFilter({
  totalReviews,
  starFilter,
  setStarFilter,
  setPageOffset,
}: ReviewsFilterProps) {
  // Normalize starFilter to an array
  const normalizedStarFilter = Array.isArray(starFilter)
    ? starFilter
    : starFilter === 0
    ? []
    : [starFilter].filter((s): s is number => typeof s === "number");

  const handleFilterChange = (stars: number) => {
    let updatedFilters: number[];
    if (stars === 0) {
      // Selecting "All" clears all other filters
      updatedFilters = [];
    } else if (normalizedStarFilter.includes(stars)) {
      // Deselect the star rating if already selected
      updatedFilters = normalizedStarFilter.filter((s) => s !== stars);
    } else {
      // Add the star rating, excluding "All" (0)
      updatedFilters = [...normalizedStarFilter.filter((s) => s !== 0), stars];
    }
    setStarFilter(updatedFilters);
    setPageOffset(0); // Reset pagination to first page
  };

  const handleResetFilter = () => {
    setStarFilter([]); // Reset to show all reviews
    setPageOffset(0); // Reset pagination
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Reviews</h3>
          <p className="text-sm text-gray-600">
            {totalReviews} total review{totalReviews === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Filter by stars:</span>
          {[0, 5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-2 py-1 rounded border text-sm ${
                normalizedStarFilter.includes(s) || (s === 0 && normalizedStarFilter.length === 0)
                  ? "bg-primary-500 text-white border-primary-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
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
            disabled={normalizedStarFilter.length === 0}
            className="ml-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}