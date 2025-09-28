import { Skeleton } from "@/components/base/skeleton";

export default function ProviderProfileSkeleton() {
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
      <div className="container px-4 py-0 lg:px-20 lg:py-10 max-w-7xl">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            {/* Provider Header Skeleton */}
            <div className="bg-white lg:bg-transparent p-4 lg:p-6 pt-0 pb-2 lg:pl-0 mb-4 shadow-none border-none">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                  <Skeleton className="size-32 rounded-full border-4 border-white shadow-lg" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <Skeleton className="h-8 w-2/3 mb-2" />
                  <Skeleton className="h-5 w-1/2 mb-3" />
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4 justify-center sm:justify-start mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="size-4 rounded-full" />
                      ))}
                      <Skeleton className="h-5 w-8 ml-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
                    <div>
                      <Skeleton className="h-6 w-10 mx-auto sm:mx-0" />
                      <Skeleton className="h-4 w-20 mx-auto sm:mx-0 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-6 w-10 mx-auto sm:mx-0" />
                      <Skeleton className="h-4 w-20 mx-auto sm:mx-0 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-6 w-10 mx-auto sm:mx-0" />
                      <Skeleton className="h-4 w-20 mx-auto sm:mx-0 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tabs Skeleton */}
            <div className="sticky top-0 z-10 bg-white rounded-lg shadow-sm p-1 mb-6">
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-10 rounded-lg mx-1" />
                ))}
              </div>
            </div>

            {/* Content Sections Skeleton */}
            <div className="space-y-4 px-4 lg:px-0 pb-6">
              {/* Overview Section Skeleton */}
              <div className="space-y-6">
                {/* About Me Card */}
                <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
                  <Skeleton className="h-6 sm:h-7 w-40" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                {/* Skills & Expertise Card */}
                <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
                  <Skeleton className="h-6 sm:h-7 w-40" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-10 rounded-lg" />
                    ))}
                  </div>
                </div>

                {/* Languages Card */}
                <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
                  <Skeleton className="h-6 sm:h-7 w-40" />
                  <div className="flex flex-wrap gap-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-24 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Services Section Skeleton */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 sm:h-7 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-48 flex-shrink-0">
                        <Skeleton className="w-full h-32 rounded-lg" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, j) => (
                              <Skeleton key={j} className="size-4 rounded-full" />
                            ))}
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviews Section Skeleton */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 sm:h-7 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Skeleton key={j} className="size-4 rounded-full" />
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
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <div className="text-center">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-40 mx-auto mt-2" />
                </div>
                <div className="space-y-3">
                  {/* <Skeleton className="h-12 w-full rounded-lg" /> */}
                </div>
                <div className="border-t pt-4 space-y-3">
                  {/* <Skeleton className="h-5 w-32" /> */}
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="size-4 rounded-full" />
                      <div>
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24 mt-1" />
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

      {/* Footer placeholder for mobile */}
      <div className="lg:hidden h-32 bg-gray-100 mt-8" />
    </div>
  );
}