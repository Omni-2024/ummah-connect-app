import { Skeleton } from "@/components/base/skeleton";

export function SkeletonServiceDetailsPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
      <div className="container py-0 lg:px-20 lg:py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            {/* Title and Quick Info Card - Comes FIRST like in ServiceHeader */}
            <div className="bg-white lg:bg-transparent p-4 lg:p-6 pt-0 pb-2 lg:pl-0 mb-4 shadow-none border-none">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  {/* Title */}
                  <Skeleton className="h-8 lg:h-9 w-4/5 mb-2" />
                  {/* Tagline */}
                  <Skeleton className="h-5 w-full mb-4" />
                  
                  {/* Educator Info Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="size-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Skeleton className="size-4 rounded-full" />
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image Section - Comes AFTER title like in ServiceHeader */}
            <div className="relative mb-6">
              <div className="relative h-48 lg:h-96 lg:rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-full" />
                {/* Discount badge skeleton */}
                <div className="absolute top-4 right-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>

            {/* Mobile Contact Button - Only visible on mobile */}
            <div className="lg:hidden mt-4 px-4">
              <div className="relative">
                <Skeleton className="h-12 w-full rounded-lg" />
                {/* Dropdown skeleton when expanded */}
                <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 opacity-0">
                  <div className="p-2 space-y-1">
                    <Skeleton className="h-10 w-full rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections - Updated for mobile first approach */}
            <div className="space-y-4 px-4 lg:px-0 pb-6">
              {/* Reviews Carousel Skeleton */}
              <div className="hidden sm:block bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex justify-end mb-2 gap-2">
                  <Skeleton className="size-9 rounded-full" />
                  <Skeleton className="size-9 rounded-full" />
                </div>
                <div className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="size-4 rounded-full" />
                          ))}
                        </div>
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>

              {/* About Service Card - Mobile optimized */}
              <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
                <Skeleton className="h-6 sm:h-7 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Why Me Section - Mobile optimized */}
              <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
                <Skeleton className="h-6 sm:h-7 w-36" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="size-5 rounded-full flex-shrink-0 mt-1" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Provider Card - Mobile First Layout */}
              <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
                <Skeleton className="h-6 sm:h-7 w-48" />
                
                {/* Mobile-first provider layout */}
                <div className="space-y-4">
                  {/* Top Row - Profile Info */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-5 sm:h-6 w-32 mb-2" />
                      {/* Location */}
                      <div className="flex items-center gap-1">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>

                  {/* Stats Row - Mobile Optimized */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1 min-w-0">
                      <Skeleton className="size-4 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-16 truncate" />
                    </div>
                    {/* Contact Button */}
                    <Skeleton className="h-8 w-20 rounded-md flex-shrink-0" />
                  </div>

                  {/* Bio - Full Width on Mobile with border */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/4 sm:hidden" /> {/* Third line only on mobile */}
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
                <Skeleton className="h-6 sm:h-7 w-36" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="size-5 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Sticky Contact Button Skeleton */}
              {/* 
              <div className="sm:hidden fixed bottom-4 left-4 right-4">
                <Skeleton className="h-12 w-full rounded-lg shadow-lg" />
              </div>
              */}
            </div>
          </div>

          {/* Desktop Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                {/* Header with share button */}
                <div className="flex items-start justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="size-9 rounded-full" />
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Learning Points */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="size-5 rounded-full flex-shrink-0 mt-0.5" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar Skeleton */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Skeleton className="h-3 w-8 mb-1" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-12 w-24 rounded-lg" />
        </div>
      </div>

      {/* Footer placeholder for mobile */}
      <div className="lg:hidden h-32 bg-gray-100 mt-8" />
    </div>
  );
}