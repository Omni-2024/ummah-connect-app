import { Skeleton } from "@/components/base/skeleton";

const ServiceCardSkeleton = () => {
  return (
    <div className="flex flex-col p-4 rounded-2xl border border-dark-50">
      <Skeleton className="w-full aspect-[344/200] h-auto min-h-[200px] rounded-2xl" />

      <Skeleton className="h-4 w-1/3 mt-4" />

      <Skeleton className="h-6 w-3/4 mt-3" />

      <Skeleton className="h-4 w-1/4 mt-8" />

      <div className="flex gap-2 items-center mt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="flex mt-8 gap-1">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
};

const CourseCardSkeletonList = ({ count = 8 }: { count?: number }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey:
        <ServiceCardSkeleton key={index} />
      ))}
    </>
  );
};

export default CourseCardSkeletonList;
