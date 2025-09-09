import { Skeleton } from "@/components/base/skeleton";

const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="border border-dark-50 rounded-2xl h-[68px]">
      <div className="flex justify-between px-6 py-6">
        <div className="flex gap-6 items-center">
          {/* Icon skeleton */}
          <Skeleton className="h-6 w-6 rounded-lg" />

          {/* Category name skeleton */}
          <Skeleton className="h-6 w-44" />
        </div>

        <div className="flex gap-3">
          <div className="flex gap-3 items-center pr-10">
            {/* Chip skeletons */}
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          {/* Edit button skeleton */}
          <Skeleton className="h-6 w-6 rounded-full" />

          {/* Accordion trigger skeleton */}
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
};

type CategoriesSkeletonProps = {
  count?: number;
};

const CategoriesSkeletonList: React.FC<CategoriesSkeletonProps> = ({
  count = 7,
}) => {
  return (
    <div className="gap-4 flex flex-col py-12 px-4">
      {[...Array(count)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey:
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CategoriesSkeletonList;
