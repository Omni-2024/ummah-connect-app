import { Skeleton } from "@/components/base/skeleton";
import { Card, CardContent } from "@/components/base/card";

const ServiceCardSkeleton = () => {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="relative">
          <Skeleton className="w-full h-52 rounded-t-lg" /> {/* slightly taller */}

          {/* Top-right action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>

          {/* Provider Avatar */}
          <Skeleton className="absolute bottom-3 left-3 h-11 w-11 rounded-full border-2 border-white" />
        </div>

        {/* Service Details */}
        <div className="p-5 space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" /> {/* profession badge */}
          <Skeleton className="h-5 w-4/5 rounded" /> {/* title */}
          <Skeleton className="h-4 w-1/2 rounded" /> {/* provider name */}

          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-4 w-36 rounded" /> {/* enrollment count */}
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-20 rounded" /> {/* price */}
              <Skeleton className="h-4 w-14 rounded" /> {/* discount price */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ServiceCardSkeletonList = ({ count = 8 }: { count?: number }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey:
        <ServiceCardSkeleton key={index} />
      ))}
    </>
  );
};

export default ServiceCardSkeletonList;
