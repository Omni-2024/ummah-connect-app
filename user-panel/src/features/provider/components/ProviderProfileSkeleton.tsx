import { Skeleton } from "@/components/base/skeleton";

export default function ProviderProfileSkeleton() {
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
      <div className="container px-4 py-4 lg:px-20 lg:py-10 max-w-7xl">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4 sm:gap-6">
                <Skeleton className="size-24 sm:size-32 rounded-full border-4 border-white shadow-lg" />
                <div className="flex-1 w-full space-y-3">
                  <Skeleton className="h-7 sm:h-8 w-48 mx-auto sm:mx-0" />
                  <Skeleton className="h-5 w-32 mx-auto sm:mx-0" />
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="size-4 rounded-full" />
                    ))}
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-1">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-9 sm:h-10 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Content Cards Skeleton */}
            <div className="space-y-4">
              {/* About Card */}
              <div className="bg-white rounded-lg p-4 sm:p-6 space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-lg p-4 sm:p-6 space-y-3">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Languages Card */}
              <div className="bg-white rounded-lg p-4 sm:p-6 space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-20 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <div className="text-center space-y-2">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="border-t pt-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="size-4 rounded-full flex-shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar Skeleton */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}