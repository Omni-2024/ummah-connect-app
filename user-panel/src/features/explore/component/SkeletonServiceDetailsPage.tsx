import { Skeleton } from "@/components/base/skeleton";

export function SkeletonServiceDetailsPage() {
  return (
    <div className="container py-4 lg:px-20 lg:py-10">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2">
          {/* Hero Image Skeleton */}
          <div className="relative mb-6">
            <Skeleton className="h-48 lg:h-56 w-full lg:rounded-2xl" />
          </div>

          {/* Title and Quick Info Card Skeleton */}
          <div className="mb-6 p-6 lm:p-0 pt-0 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                {/* Rating and Students Skeleton */}
                <div className="mb-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-8 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded" />
                </div>

                {/* Title Skeleton */}
                <Skeleton className="h-8 lg:h-9 w-3/4 mb-2 rounded" />

                {/* Tagline Skeleton */}
                <Skeleton className="h-6 w-full mb-4 rounded" />

                {/* Duration, CME Points, and CME ID Skeleton */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>

              {/* Mobile pricing preview skeleton */}
              <div className="lg:hidden w-full">
                <Skeleton className="h-8 w-24 mb-2 rounded" />
                <Skeleton className="h-4 w-16 mb-3 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>

          {/* Educator Info Skeleton */}
          <div className="mb-6 p-4 bg-white">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>

          {/* Content Sections Skeleton */}
          <div className="space-y-6">
            {/* Description Section Skeleton */}
            <div className="p-6 pt-0 bg-white">
              <Skeleton className="h-6 w-40 mb-4 rounded" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>

            {/* Learning Points Section Skeleton */}
            <div className="lg:p-6 p-6 pt-0 bg-white">
              <Skeleton className="h-6 w-36 mb-4 rounded" />
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-green-50"
                  >
                    <Skeleton className="size-6 rounded-full flex-shrink-0 mt-0.5" />
                    <Skeleton className="h-4 flex-1 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block lg:col-span-1 mt-6 lg:mt-0">
          <div className="sticky top-16">
            <div className="m-6 p-4 lg:m-0 bg-white lg:shadow-lg border border-gray-200 rounded-lg">
              {/* Heading Skeleton */}
              <Skeleton className="h-8 w-32 mb-6 rounded" />

              {/* Pricing Skeleton */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <Skeleton className="h-9 w-20 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-24 rounded" />
              </div>

              {/* Enrollment Button Skeleton */}
              <Skeleton className="h-12 w-full mb-4 rounded-lg" />

              {/* Quick Stats Skeleton */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-6 w-12 mx-auto mb-1 rounded" />
                  <Skeleton className="h-3 w-16 mx-auto rounded" />
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-6 w-8 mx-auto mb-1 rounded" />
                  <Skeleton className="h-3 w-20 mx-auto rounded" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Buttons Skeleton */}
        <div className="flex gap-2 m-6 lg:hidden">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
}